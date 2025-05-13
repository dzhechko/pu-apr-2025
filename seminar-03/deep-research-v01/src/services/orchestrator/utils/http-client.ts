import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import config from '../../../shared/config';
import { createError } from '../../../shared/utils/error-handler';

/**
 * HTTP client for communicating with other services
 */
export const httpClient = {
  /**
   * Send a request to the Triage service
   */
  triage: {
    /**
     * Generate a research plan for a question
     */
    createPlan: async (question: string): Promise<any> => {
      try {
        const response = await axios.post(
          `${config.services.triage.url}/api/plan`,
          { question },
          {
            timeout: config.performance.totalReportTimeoutMs / 3, // Allocate 1/3 of total time for triage
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        return response.data;
      } catch (error: any) {
        console.error('[ORCHESTRATOR] Error calling Triage service:', error);
        
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw createError.serviceUnavailable(`Triage service error: ${error.response.data?.error?.message || error.message}`);
        } else if (error.request) {
          // The request was made but no response was received
          throw createError.serviceUnavailable('Triage service unavailable');
        } else {
          // Something happened in setting up the request that triggered an Error
          throw createError.internalServerError(`Error setting up request to Triage service: ${error.message}`);
        }
      }
    },
  },
  
  /**
   * Send a request to the Research service
   */
  research: {
    /**
     * Execute a search for a specific query
     */
    search: async (searchRequest: any): Promise<any> => {
      try {
        const response = await axios.post(
          `${config.services.research.url}/api/search`,
          searchRequest,
          {
            timeout: config.performance.searchTimeoutMs * 2, // Double the timeout for research queries
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        return response.data;
      } catch (error: any) {
        console.error('[ORCHESTRATOR] Error calling Research service:', error);
        
        if (error.response) {
          throw createError.serviceUnavailable(`Research service error: ${error.response.data?.error?.message || error.message}`);
        } else if (error.request) {
          throw createError.serviceUnavailable('Research service unavailable');
        } else {
          throw createError.internalServerError(`Error setting up request to Research service: ${error.message}`);
        }
      }
    },
  },
  
  /**
   * Send a request to the Editor service
   */
  editor: {
    /**
     * Compile search results into a report
     */
    compileReport: async (compileRequest: any): Promise<any> => {
      try {
        const response = await axios.post(
          `${config.services.editor.url}/api/compile`,
          compileRequest,
          {
            timeout: config.performance.totalReportTimeoutMs / 2, // Allocate 1/2 of total time for editor (increased from 1/3)
            headers: {
              'Content-Type': 'application/json',
            },
            maxContentLength: 10 * 1024 * 1024, // Allow for larger responses (10MB)
            maxBodyLength: 10 * 1024 * 1024,    // Allow for larger requests (10MB)
          }
        );
        
        return response.data;
      } catch (error: any) {
        console.error('[ORCHESTRATOR] Error calling Editor service:', error);
        
        if (error.response) {
          throw createError.serviceUnavailable(`Editor service error: ${error.response.data?.error?.message || error.message}`);
        } else if (error.request) {
          throw createError.serviceUnavailable('Editor service unavailable');
        } else {
          throw createError.internalServerError(`Error setting up request to Editor service: ${error.message}`);
        }
      }
    },
  },
}; 