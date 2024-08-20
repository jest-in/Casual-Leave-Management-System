import catchAsync from "@/lib/catchAsync";
import { NextResponse } from "next/server";

export const GET = catchAsync(async (request, context) => {
  const response = NextResponse.json({ message: "success" }, { status: 200 });

  response.cookies.set("token", "", {
    expires: new Date(0),
    secure: true,
    httpOnly: true,
    path: "/",
    sameSite: "strict",
  });

  return response;
});
