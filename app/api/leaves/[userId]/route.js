import catchAsync from "@/lib/catchAsync";
import Leave from "@/lib/modals/leave";
import { NextResponse } from "next/server";

// View leaves applied by Faculty
export const GET = catchAsync(async (request, context) => {
  const { userId } = context.params;
  const leaves = await Leave.find({ userId });
  return NextResponse.json(
    { message: "success", body: leaves },
    { status: 200 }
  );
});
