import { NextResponse } from "next/server";
import catchAsync from "./lib/catchAsync";

export const middleware = catchAsync(async (request, context) => {
  const url = request.nextUrl.clone();
  const path = url.pathname;
  const token = request.cookies.get("token")?.value || "";

  // Check whether the request is for static files, if then complete request
  if (path.includes("/_next/") || path.includes("/favicon.ico"))
    return NextResponse.next();

  const public_url = ["/", "/api/login"];

  // Check whether user is logged in
  if (!token && !public_url.includes(path))
    return NextResponse.redirect(new URL("/", request.nextUrl));

  // const user = await User.findById(id);

  // If no user in DB
  // if (!user) {
  //   return NextResponse.json({ error: "User not found" }, { status: 200 });
  // }

  const response = NextResponse.next();

  return response;
});

export const config = {
  matcher: ["/:path*"],
};
