import { Request, Response } from 'express';
/**
 * Controller for handling research requests
 */
export declare const askController: {
    /**
     * Process a research request and return a report
     */
    ask: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Health check endpoint
     */
    healthCheck: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
