import { ApiError } from "../utils/utilBarrel.js";

export const errorHandler = (err, req, res, next) => {
  // default values
  // console.log(err) -> this is the ApiError object that is an instance of Error
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // If error is NOT ApiError, normalize it
  if (!(err instanceof ApiError)) {
    statusCode = 500;
    message = "Internal Server Error";
  }

  // Log full error (important for CI/CD & prod logs)
  console.error("ERROR!!", {
    message: err.message,
    stack: err.stack,
    code: statusCode,
  });

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
};
