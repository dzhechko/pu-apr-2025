import { Request, Response } from 'express';
import { generateResearchPlan } from '../utils/openai';
import { asyncHandler } from '../../../shared/utils/error-handler';
import { PlanRequest } from '../../../shared/types';

/**
 * Controller for handling research plan generation requests
 */
export const planController = {
  /**
   * Generate a research plan for a question
   */
  createPlan: asyncHandler(async (req: Request, res: Response) => {
    const planRequest: PlanRequest = req.body;
    
    // Validate request
    if (!planRequest.question) {
      return res.status(400).json({
        error: {
          message: 'Invalid plan request. Question is required.',
        },
      });
    }
    
    // Log the plan request
    console.log(`[TRIAGE] Processing plan request for: "${planRequest.question}"`);
    
    // Generate the research plan
    const planResponse = await generateResearchPlan(planRequest);
    
    // Return the plan
    return res.status(200).json(planResponse);
  }),
  
  /**
   * Health check endpoint
   */
  healthCheck: asyncHandler(async (_req: Request, res: Response) => {
    return res.status(200).json({
      service: 'triage',
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }),
}; 