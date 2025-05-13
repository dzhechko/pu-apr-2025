import { Request, Response } from 'express';
import { compileReport } from '../utils/openai';
import { asyncHandler } from '../../../shared/utils/error-handler';
import { CompileRequest } from '../../../shared/types';

/**
 * Controller for handling report compilation requests
 */
export const compileController = {
  /**
   * Compile search results into a report
   */
  compileReport: asyncHandler(async (req: Request, res: Response) => {
    const compileRequest: CompileRequest = req.body;
    
    // Validate request
    if (!compileRequest.originalQuestion || !compileRequest.plan || !compileRequest.results) {
      return res.status(400).json({
        error: {
          message: 'Invalid compile request. Original question, plan, and results are required.',
        },
      });
    }
    
    // Log the compile request
    console.log(`[EDITOR] Processing compile request for: "${compileRequest.originalQuestion}"`);
    
    // Compile the report
    const reportMarkdown = await compileReport(compileRequest);
    
    // Return the report
    return res.status(200).json({
      report: reportMarkdown,
      originalQuestion: compileRequest.originalQuestion,
      timestamp: new Date().toISOString(),
    });
  }),
  
  /**
   * Health check endpoint
   */
  healthCheck: asyncHandler(async (_req: Request, res: Response) => {
    return res.status(200).json({
      service: 'editor',
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }),
}; 