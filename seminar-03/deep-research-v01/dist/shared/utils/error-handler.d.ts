import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ApiError } from '../types';
/**
 * Custom error class for API errors
 */
export declare class ApiErrorClass implements ApiError {
    status: number;
    message: string;
    details?: any;
    constructor(status: number, message: string, details?: any);
}
/**
 * Error handler middleware for Express
 */
export declare const errorHandler: ErrorRequestHandler;
/**
 * Async handler to catch errors in async route handlers
 */
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Helper functions to create common API errors
 */
export declare const createError: {
    badRequest: (message: string, details?: any) => ApiErrorClass;
    unauthorized: (message: string, details?: any) => ApiErrorClass;
    forbidden: (message: string, details?: any) => ApiErrorClass;
    notFound: (message: string, details?: any) => ApiErrorClass;
    conflict: (message: string, details?: any) => ApiErrorClass;
    internalServerError: (message: string, details?: any) => ApiErrorClass;
    serviceUnavailable: (message: string, details?: any) => ApiErrorClass;
    timeoutError: (message: string, details?: any) => ApiErrorClass;
};
