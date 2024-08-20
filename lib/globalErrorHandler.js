import { NextResponse } from "next/server";

const globalErrorHandler = (
  message = "Oops!, something went wrong [Idhokke Shradhikande Ambaane:(]",
  status = 500
) => {
  return new NextResponse(message, { status });
};

export default globalErrorHandler;
