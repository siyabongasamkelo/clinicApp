export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    // Maintains proper stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}
