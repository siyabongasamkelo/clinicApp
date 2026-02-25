import logger from "../utils/logger.js";

export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // 🚀 Instead of console.error, use Winston!
  logger.error(
    `${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
  );

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
