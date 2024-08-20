import getDataFromToken from "@/helpers/getDataFromToken";
import catchAsync from "@/lib/catchAsync";
import { connect } from "@/lib/db";
import globalErrorHandler from "@/lib/globalErrorHandler";
import Leave from "@/lib/modals/leave";
import User from "@/lib/modals/user";
import mongoose from "mongoose";

const { NextResponse } = require("next/server");

export const GET = catchAsync(async (request, context) => {
  const { id: userId } = await getDataFromToken(
    request.cookies.get("token")?.value
  );

  await connect();
  const leaves = await Leave.find({
    approvers: {
      $elemMatch: {
        approverId: new mongoose.Types.ObjectId(userId),
        status: { $in: ["Pending", "Rejected"] },
      },
    },
  }).populate({
    path: "userId",
    select: "username email -_id",
  });

  console.log(leaves);

  // Only retrieve those leaves which are approved by lower level approvers
  const filteredLeaves = leaves.filter((leave) => {
    // If the approver is the first one to approve in the hierarchy
    if (leave.approvers[0].approverId.equals(userId)) return true;
    for (let i = 1; i < leave.approvers.length; i++) {
      if (
        leave.approvers[i].approverId.equals(userId) &&
        (leave.approvers[i].status === "Pending" ||
          leave.approvers[i].status === "Rejected") &&
        leave.approvers[i - 1].status === "Approved"
      ) {
        return true;
      }
    }
    return false;
  });

  return NextResponse.json(
    { message: "Success", body: filteredLeaves },
    { status: 200 }
  );
});

export const POST = catchAsync(async (request) => {
  const { id: userId, role: userRole } = await getDataFromToken(
    request.cookies.get("token")?.value
  );
  let { leaveType, description, date, leaveDuration } = await request.json();

  await connect();
  // Get user by ID
  const user = await User.findById(userId);

  if (leaveType === "casual leave") {
    const casualLeaveCreditsBalance = user.leave_credits.casual_leave;
    if (!casualLeaveCreditsBalance)
      return NextResponse.json(
        { error: "Casual leave credits are already exhausted" },
        { status: 400 }
      );
  }

  if (leaveType === "compensatory leave") {
    const compensatoryLeaveCreditsBalance =
      user.leave_credits.compensatory_leave;
    if (!compensatoryLeaveCreditsBalance)
      return NextResponse.json(
        { error: "Compensatory leave credits are already exhausted" },
        { status: 400 }
      );
  }

  let approvers = [];

  // If Faculty (Currently only faculty can apply leave)
  if (userRole !== "FACULTY")
    return NextResponse.json(
      { error: "Currently applying for leave is only available for faculty" },
      { status: 400 }
    );
  const hodId = await User.findOne({
    department: user.department,
    role: "HOD",
  });
  const principalId = await User.findOne({ role: "PRINCIPAL" });
  const hrId = await User.findOne({ role: "HR" });
  approvers.push({ approverId: hodId });
  approvers.push({ approverId: principalId });
  approvers.push({ approverId: hrId });

  // Save new leave
  const newLeave = new Leave({
    userId,
    leaveType,
    date,
    leaveDuration,
    description,
    approvers,
  });
  await newLeave.save();
  return NextResponse.json(
    { message: "success", body: newLeave },
    { status: 200 }
  );
});

export const PATCH = catchAsync(async (request, context) => {
  const { id: userId } = await getDataFromToken(
    request.cookies.get("token")?.value
  );
  const { id: leaveId, rejected, rejectReason } = await request.json();

  if (!leaveId)
    return NextResponse.json({ error: "Missing leave ID" }, { status: 400 });

  await connect();
  const leave = await Leave.findOne({
    _id: leaveId,
    approvers: {
      $elemMatch: {
        approverId: new mongoose.Types.ObjectId(userId),
        status: { $in: ["Pending", "Rejected"] },
      },
    },
  });

  if (!leave)
    return NextResponse.json(
      { error: "Leave does not exist" },
      { status: 400 }
    );

  //
  const approvers = leave.approvers;
  const lastApproverIndex = approvers.length - 1;
  const currentApproverIndex = approvers.findIndex((approver) =>
    approver.approverId.equals(userId)
  );
  // If the current approver is not the first one among approvers
  if (currentApproverIndex != 0) {
    const previousApproverIndex = currentApproverIndex - 1;
    // If previous approver has not approved leave
    if (approvers[previousApproverIndex].status !== "Approved")
      return NextResponse.json({ error: "Permission denied" }, { status: 400 });
  }
  // Field to be changed in the document(status is Rejected if the request body has rejected)
  const updatingFields = {
    status: "Pending",
    "approvers.$.status": rejected ? "Rejected" : "Approved",
  };

  // If the current approver is the last one to approve the leave(Changes the status of leave to Approved)
  if (lastApproverIndex === currentApproverIndex && !rejected)
    updatingFields["status"] = "Approved";

  // If the leave is rejected add the reason for reject
  if (rejected) {
    updatingFields.status = "Rejected";
    updatingFields["approvers.$.rejectReason"] = rejectReason;
  }

  // Using Transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const approvedLeave = await Leave.findOneAndUpdate(
      {
        _id: leaveId,
        "approvers.approverId": new mongoose.Types.ObjectId(userId),
      },
      { $set: updatingFields },
      { new: true, session }
    ).populate({
      path: "userId",
      select: "username email -_id",
    });

    let leaveTypeFieldForQuery;
    if (leave.leaveType === "compensatory leave")
      leaveTypeFieldForQuery = "leave_credits.compensatory_leave";
    else if (leave.leaveType === "casual leave")
      leaveTypeFieldForQuery = "leave_credits.casual_leave";

    await User.findOneAndUpdate(
      {
        _id: leave.userId,
        [leaveTypeFieldForQuery]: { $gt: 0 },
      },
      {
        $inc: {
          [leaveTypeFieldForQuery]: -1,
        },
      },
      {
        session,
      }
    );

    // Commit transaction if the update is successful
    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      { message: "success", body: approvedLeave },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error:", error);
    await session.abortTransaction();
    session.endSession();
    return globalErrorHandler();
  }
});
