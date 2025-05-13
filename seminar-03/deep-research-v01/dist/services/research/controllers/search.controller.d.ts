import { Request, Response } from 'express';
/**
 * Controller for handling search requests to the Research Service
 */
export declare const searchController: {
    /**
     * Execute a search based on a PlanItem
     */
    search: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Health check endpoint
     */
    healthCheck: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
