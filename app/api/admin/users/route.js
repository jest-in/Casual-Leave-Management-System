import getDataFromToken from "@/helpers/getDataFromToken";
import isUserAuthorized from "@/helpers/isUserAuthorized";
import catchAsync from "@/lib/catchAsync";
import { connect } from "@/lib/db";
import User from "@/lib/modals/user";
import bcryptjs from "bcryptjs";

const { NextResponse } = require("next/server");

// View all users by ADMIN
export const GET = catchAsync(async (request, context) => {
  await connect();
  const users = await User.find();
  return NextResponse.json({ message: "success", users }, { status: 200 });
});

// Create User by ADMIN
export const POST = catchAsync(async (request, context) => {
  // Authorized users
  const allowedUsers = ["ADMIN"];

  const { role: userRole } = await getDataFromToken(
    request.cookies.get("token")?.value
  );

  if (!isUserAuthorized(allowedUsers, userRole))
    return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });

  const body = await request.json();
  const { email, username, password, role, department, leave_credits } = body;

  await connect();

  if (await User.findOne({ email }))
    return NextResponse.json({ error: "User already exists" }, { status: 400 });

  // hash password
  const salt = await bcryptjs.genSalt();
  const hashedPassword = await bcryptjs.hash(password, salt);

  // Create new user
  const newUser = new User({
    email,
    username,
    password: hashedPassword,
    role,
    department,
    leave_credits,
  });
  const user = await newUser.save();
  return NextResponse.json({ message: "success", user }, { status: 200 });
});
