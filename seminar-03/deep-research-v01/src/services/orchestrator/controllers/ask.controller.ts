import { Request, Response } from 'express';
import axios from 'axios';
import { asyncHandler } from '../../../shared/utils/error-handler';
import { httpClient } from '../utils/http-client';
import { AskRequest, PlanItem, ResearchProgress, SearchResponse } from '../../../shared/types';
import config from '../../../shared/config';

/**
 * Create a fallback report when the Editor service is unavailable
 */
function createFallbackReport(question: string, results: SearchResponse[]): string {
  let report = `# Research Results: ${question}\n\n`;
  report += `## Summary\n\nWe've gathered some relevant information but couldn't format it into a complete report.\n\n`;
  report += `## Raw Research Results\n\n`;
  
  // Add results with hits
  const resultsWithHits = results.filter(r => r.hits.length > 0);
  if (resultsWithHits.length === 0) {
    report += "No search results were found for this query.\n\n";
  } else {
    resultsWithHits.forEach((result, index) => {
      report += `### Search Query: ${result.query}\n\n`;
      
      result.hits.forEach((hit, hitIndex) => {
        report += `#### Result ${hitIndex + 1}: ${hit.title || 'No title'}\n`;
        report += `Source: [${hit.url}](${hit.url})\n\n`;
        report += `${hit.snippet}\n\n`;
      });
    });
  }
  
  report += `## Note\n\nThis is a simplified report generated due to issues with our report formatting service. `;
  report += `For a complete analysis, please try again later.\n`;
  
  return report;
}

/**
 * Controller for handling research requests
 */
export const askController = {
  /**
   * Process a research request and return a report
   */
  ask: asyncHandler(async (req: Request, res: Response) => {
    // Extract question from either body (POST) or query params (GET)
    let question: string;
    
    if (req.method === 'GET') {
      question = req.query.question as string;
    } else {
      const askRequest: AskRequest = req.body;
      question = askRequest.question;
    }
    
    // Validate request
    if (!question) {
      return res.status(400).json({
        error: {
          message: 'Invalid research request. Question is required.',
        },
      });
    }
    
    // Log the research request
    console.log(`[ORCHESTRATOR] Processing research request for: "${question}"`);
    
    // Set up SSE for streaming progress updates
    if (req.headers.accept && req.headers.accept.includes('text/event-stream')) {
      // Set headers for SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Send progress updates as SSE
      const sendProgress = (progress: ResearchProgress) => {
        res.write(`data: ${JSON.stringify(progress)}\n\n`);
      };
      
      try {
        // Step 1: Triage - Generate a research plan
        sendProgress({
          stage: 'triage',
          progress: 0,
          message: 'Analyzing question and creating research plan...',
        });
        
        let planResponse;
        try {
          planResponse = await httpClient.triage.createPlan(question);
          
          sendProgress({
            stage: 'triage',
            progress: 100,
            message: `Research plan created with ${planResponse.plan.length} queries.`,
          });
        } catch (error: any) {
          console.error('[ORCHESTRATOR] Error in triage stage:', error);
          sendProgress({
            stage: 'error',
            progress: 0,
            message: `Failed to create research plan: ${error.message || 'Unknown error'}`,
          });
          return res.end();
        }
        
        // Step 2: Research - Execute searches for each query in the plan
        sendProgress({
          stage: 'research',
          progress: 0,
          message: 'Beginning research phase...',
        });
        
        const searchResults: SearchResponse[] = [];
        let completedSearches = 0;
        let searchErrors = 0;
        
        // Sort plan items by priority
        const sortedPlan = [...planResponse.plan].sort((a, b) => a.priority - b.priority);
        
        // Execute searches in batches based on maxConcurrentSearches
        for (let i = 0; i < sortedPlan.length; i += config.performance.maxConcurrentSearches) {
          const batch = sortedPlan.slice(i, i + config.performance.maxConcurrentSearches);
          
          // Execute searches in parallel
          const batchPromises = batch.map((planItem: PlanItem) => 
            httpClient.research.search(planItem)
          );
          
          const batchResults = await Promise.allSettled(batchPromises);
          
          // Process batch results
          batchResults.forEach((result, index) => {
            completedSearches++;
            
            if (result.status === 'fulfilled') {
              searchResults.push(result.value);
            } else {
              searchErrors++;
              console.error(`[ORCHESTRATOR] Search failed for query: "${batch[index].query}"`, result.reason);
              // Add empty result for failed search to maintain order
              searchResults.push({
                query: batch[index].query,
                hits: [],
              });
            }
            
            // Send progress update
            const searchProgress = Math.round((completedSearches / sortedPlan.length) * 100);
            sendProgress({
              stage: 'research',
              progress: searchProgress,
              message: `Completed ${completedSearches} of ${sortedPlan.length} searches (${searchErrors} failed)...`,
            });
          });
        }
        
        // Check if all searches failed
        if (searchErrors === sortedPlan.length) {
          sendProgress({
            stage: 'error',
            progress: 0,
            message: 'All research searches failed. Please try again later.',
          });
          return res.end();
        }
        
        // Step 3: Editor - Compile search results into a report
        sendProgress({
          stage: 'editor',
          progress: 0,
          message: 'Compiling research results into a report...',
        });
        
        const compileRequest = {
          originalQuestion: question,
          plan: planResponse.plan,
          results: searchResults,
        };
        
        try {
          const reportResponse = await httpClient.editor.compileReport(compileRequest);
          
          sendProgress({
            stage: 'editor',
            progress: 100,
            message: 'Report successfully generated.',
          });
          
          // Send complete report
          sendProgress({
            stage: 'complete',
            progress: 100,
            message: 'Research complete!',
          });
          
          // Send the report as the final event
          res.write(`data: ${JSON.stringify({ 
            report: reportResponse.report,
            originalQuestion: question,
            timestamp: new Date().toISOString(),
          })}\n\n`);
          
          // End the response
          return res.end();
        } catch (editorError: any) {
          console.error('[ORCHESTRATOR] Error in editor stage:', editorError);
          
          // If editor service failed but we have search results, create a fallback report
          if (searchResults.some(result => result.hits.length > 0)) {
            const fallbackReport = createFallbackReport(question, searchResults);
            
            sendProgress({
              stage: 'complete',
              progress: 100,
              message: 'Created simplified report due to editing service issues.',
            });
            
            res.write(`data: ${JSON.stringify({ 
              report: fallbackReport,
              originalQuestion: question,
              timestamp: new Date().toISOString(),
            })}\n\n`);
            
            return res.end();
          }
          
          // If no results or fallback possible, return error
          sendProgress({
            stage: 'error',
            progress: 0,
            message: `Error generating report: ${editorError.message || 'Editor service unavailable'}`,
          });
          
          return res.end();
        }
      } catch (error: any) {
        console.error('[ORCHESTRATOR] Error processing research request:', error);
        
        sendProgress({
          stage: 'error',
          progress: 0,
          message: `Error: ${error.message || 'Unknown error occurred'}`,
        });
        
        // End the response
        return res.end();
      }
    } else {
      // Non-streaming version (regular HTTP response)
      try {
        // Step 1: Triage - Generate a research plan
        const planResponse = await httpClient.triage.createPlan(question);
        
        // Step 2: Research - Execute searches for each query in the plan
        const searchResults: SearchResponse[] = [];
        
        // Sort plan items by priority
        const sortedPlan = [...planResponse.plan].sort((a, b) => a.priority - b.priority);
        
        // Execute searches in batches based on maxConcurrentSearches
        for (let i = 0; i < sortedPlan.length; i += config.performance.maxConcurrentSearches) {
          const batch = sortedPlan.slice(i, i + config.performance.maxConcurrentSearches);
          
          // Execute searches in parallel
          const batchPromises = batch.map((planItem: PlanItem) => 
            httpClient.research.search(planItem)
          );
          
          const batchResults = await Promise.allSettled(batchPromises);
          
          // Process batch results
          batchResults.forEach((result, index) => {
            if (result.status === 'fulfilled') {
              searchResults.push(result.value);
            } else {
              console.error(`[ORCHESTRATOR] Search failed for query: "${batch[index].query}"`, result.reason);
              // Add empty result for failed search to maintain order
              searchResults.push({
                query: batch[index].query,
                hits: [],
              });
            }
          });
        }
        
        // Step 3: Editor - Compile search results into a report
        const compileRequest = {
          originalQuestion: question,
          plan: planResponse.plan,
          results: searchResults,
        };
        
        try {
          const reportResponse = await httpClient.editor.compileReport(compileRequest);
          
          // Return the complete response
          return res.status(200).json({
            report: reportResponse.report,
            originalQuestion: question,
            timestamp: new Date().toISOString(),
          });
        } catch (editorError) {
          console.error('[ORCHESTRATOR] Error calling Editor service:', editorError);
          
          // If editor service failed but we have search results, create a fallback report
          if (searchResults.some(result => result.hits.length > 0)) {
            const fallbackReport = createFallbackReport(question, searchResults);
            
            return res.status(200).json({
              report: fallbackReport,
              originalQuestion: question,
              timestamp: new Date().toISOString(),
              note: 'This is a simplified report due to issues with our report formatting service.'
            });
          }
          
          // If no results or fallback possible, return error
          return res.status(503).json({
            error: {
              message: 'Editor service unavailable',
              details: 'Could not generate a formatted report at this time.'
            }
          });
        }
      } catch (error: any) {
        console.error('[ORCHESTRATOR] Error processing research request:', error);
        
        return res.status(error.status || 500).json({
          error: {
            message: error.message || 'An unexpected error occurred',
            details: error.details,
          },
        });
      }
    }
  }),
  
  /**
   * Health check endpoint
   */
  healthCheck: asyncHandler(async (_req: Request, res: Response) => {
    // Check health of all services
    const healthChecks = {
      orchestrator: { status: 'ok' },
      triage: { status: 'unknown' },
      research: { status: 'unknown' },
      editor: { status: 'unknown' },
    };
    
    try {
      await axios.get(`${config.services.triage.url}/api/plan/health`);
      healthChecks.triage.status = 'ok';
    } catch (error) {
      healthChecks.triage.status = 'error';
    }
    
    try {
      await axios.get(`${config.services.research.url}/api/search/health`);
      healthChecks.research.status = 'ok';
    } catch (error) {
      healthChecks.research.status = 'error';
    }
    
    try {
      await axios.get(`${config.services.editor.url}/api/compile/health`);
      healthChecks.editor.status = 'ok';
    } catch (error) {
      healthChecks.editor.status = 'error';
    }
    
    // Calculate overall status
    const overallStatus = Object.values(healthChecks).every(check => check.status === 'ok')
      ? 'ok'
      : 'degraded';
    
    return res.status(200).json({
      service: 'orchestrator',
      status: overallStatus,
      services: healthChecks,
      timestamp: new Date().toISOString(),
    });
  }),
}; 