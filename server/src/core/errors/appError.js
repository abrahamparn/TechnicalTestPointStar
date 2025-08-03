export class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details; // Attach the details to the instance

    this.isOperational = true; // Flag to distinguish from programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}
