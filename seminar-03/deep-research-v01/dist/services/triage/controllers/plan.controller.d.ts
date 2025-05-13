import { Request, Response } from 'express';
/**
 * Controller for handling research plan generation requests
 */
export declare const planController: {
    /**
     * Generate a research plan for a question
     */
    createPlan: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Health check endpoint
     */
    healthCheck: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
