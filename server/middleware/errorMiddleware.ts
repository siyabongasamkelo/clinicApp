import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/errorApi";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let { statusCode, message } = err;

  // If it's not a custom ApiError, default to 500 (Server Error)
  if (!statusCode) statusCode = 500;

  // In production, you don't want to send the full stack trace to the user
  const response = {
    success: false,
    message: message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  if (process.env.NODE_ENV === "development") {
    console.error("ERROR :", err);
  }

  res.status(statusCode).json(response);
};
