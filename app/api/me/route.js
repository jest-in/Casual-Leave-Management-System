import getDataFromToken from "@/helpers/getDataFromToken";
import catchAsync from "@/lib/catchAsync";
import { NextResponse } from "next/server";

export const GET = catchAsync(async (request, context) => {
  const userData = await getDataFromToken(request.cookies.get("token")?.value);
  return NextResponse.json(
    { message: "success", body: userData },
    { status: 200 }
  );
});
