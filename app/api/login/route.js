import catchAsync from "@/lib/catchAsync";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { connect } from "@/lib/db";

export const POST = catchAsync(async (request, context) => {
  const body = await request.json();
  const { email, password } = body;

  connect();

  // Check whether the user exists
  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json(
      { message: "Invalid username or password" },
      { status: 400 }
    );

  // Check if password is correct
  const validPassword = await bcryptjs.compare(password, user.password);
  if (!validPassword)
    return NextResponse.json(
      { message: "Invalid username or password" },
      { status: 400 }
    );

  // Create token data
  const tokenData = {
    id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
  };
  // Create token
  const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const response = NextResponse.json(
    { message: "success", body: user },
    { status: 200 }
  );

  response.cookies.set("token", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
    path: "/",
    sameSite: "strict",
  });

  return response;
});
