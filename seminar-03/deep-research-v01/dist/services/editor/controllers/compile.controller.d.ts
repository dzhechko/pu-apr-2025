import { Request, Response } from 'express';
/**
 * Controller for handling report compilation requests
 */
export declare const compileController: {
    /**
     * Compile search results into a report
     */
    compileReport: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Health check endpoint
     */
    healthCheck: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
