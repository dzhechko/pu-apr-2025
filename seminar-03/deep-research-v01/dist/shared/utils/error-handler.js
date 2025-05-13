"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.asyncHandler = exports.errorHandler = exports.ApiErrorClass = void 0;
/**
 * Custom error class for API errors
 */
class ApiErrorClass {
    constructor(status, message, details) {
        this.status = status;
        this.message = message;
        this.details = details;
    }
}
exports.ApiErrorClass = ApiErrorClass;
/**
 * Error handler middleware for Express
 */
const errorHandler = (err, req, res, next) => {
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
exports.errorHandler = errorHandler;
/**
 * Async handler to catch errors in async route handlers
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
/**
 * Helper functions to create common API errors
 */
exports.createError = {
    badRequest: (message, details) => new ApiErrorClass(400, message, details),
    unauthorized: (message, details) => new ApiErrorClass(401, message, details),
    forbidden: (message, details) => new ApiErrorClass(403, message, details),
    notFound: (message, details) => new ApiErrorClass(404, message, details),
    conflict: (message, details) => new ApiErrorClass(409, message, details),
    internalServerError: (message, details) => new ApiErrorClass(500, message, details),
    serviceUnavailable: (message, details) => new ApiErrorClass(503, message, details),
    timeoutError: (message, details) => new ApiErrorClass(504, message, details),
};
