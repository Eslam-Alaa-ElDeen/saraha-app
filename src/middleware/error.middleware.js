export const globalErrorHandling = (error, req, res, next) => {
  const status = error.cause?.status || 500;
  // const extra=error.cause.extra || undefined;
  return res
    .status(status)
    .json({
      error,
      // extra,
      error_message: error.message || "something went wrong",
      stack: error.stack,
    });
};
