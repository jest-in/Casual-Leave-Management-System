import catchAsync from "@/lib/catchAsync";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";

export const GET = catchAsync(async (request, context) => {
  const { userId } = context.params;
  const user = await User.findOne({ _id: userId }).select("leave_credits -_id");
  return NextResponse.json({ message: "success", body: user }, { status: 200 });
});
