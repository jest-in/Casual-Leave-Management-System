import globalErrorHandler from "./globalErrorHandler";

const catchAsync = (fn) => {
  return async (request, context) => {
    try {
      return await fn(request, context);
    } catch (err) {
      console.error(err);
      return globalErrorHandler();
    }
  };
};

export default catchAsync;
