import catchAsync from "@/lib/catchAsync";
import { NextResponse } from "next/server";

export const PATCH = catchAsync(async (request, context) => {
  const { role } = await getDataFromToken(request.cookies.get("token")?.value);
  if (!role || role !== "ADMIN")
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 200 }
    );
  const body = await request.json();
  return NextResponse.json({ message: "success" }, { status: 200 });
});
