import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ApiError } from '../types';

/**
 * Custom error class for API errors
 */
export class ApiErrorClass implements ApiError {
  status: number;
  message: string;
  details?: any;

  constructor(status: number, message: string, details?: any) {
    this.status = status;
    this.message = message;
    this.details = details;
  }
}

/**
 * Error handler middleware for Express
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error | ApiErrorClass,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`[ERROR] ${err.message}`, err);

  if (err instanceof ApiErrorClass) {
    res.status(err.status).json({
      error: {
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  // Default to 500 for unknown errors
  res.status(500).json({
    error: {
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    },
  });
};

/**
 * Async handler to catch errors in async route handlers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Helper functions to create common API errors
 */
export const createError = {
  badRequest: (message: string, details?: any) => new ApiErrorClass(400, message, details),
  unauthorized: (message: string, details?: any) => new ApiErrorClass(401, message, details),
  forbidden: (message: string, details?: any) => new ApiErrorClass(403, message, details),
  notFound: (message: string, details?: any) => new ApiErrorClass(404, message, details),
  conflict: (message: string, details?: any) => new ApiErrorClass(409, message, details),
  internalServerError: (message: string, details?: any) => new ApiErrorClass(500, message, details),
  serviceUnavailable: (message: string, details?: any) => new ApiErrorClass(503, message, details),
  timeoutError: (message: string, details?: any) => new ApiErrorClass(504, message, details),
}; 