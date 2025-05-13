import Exa from 'exa-js';
import config from '../../../shared/config';
import { ExaSearchParams, Hit, SearchResponse } from '../../../shared/types';
import { createError } from '../../../shared/utils/error-handler';

// Initialize Exa client with API key
const exa = new Exa(config.api.exa.apiKey);

/**
 * Search the internet using Exa API
 * Based on the Langbase example: https://langbase.com/docs/examples/internet-research-tool
 */
export async function searchInternet({
  query,
  domain,
  numResults = config.performance.maxResultsPerSearch,
  useAutoprompt = false,
}: ExaSearchParams): Promise<SearchResponse> {
  try {
    console.log(`[EXA] Searching for: "${query}" in domain: ${domain}`);
    
    // Set up a timeout for the search request
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(createError.timeoutError(`Search request timed out after ${config.performance.searchTimeoutMs}ms`));
      }, config.performance.searchTimeoutMs);
    });
    
    // Execute the search request with timeout
    const searchPromise = exa.searchAndContents(query, {
      text: true,
      highlight: true,
      type: 'keyword',
      includeDomains: [domain],
      numResults: numResults,
      useAutoprompt: useAutoprompt,
    });
    
    // Race between the search and the timeout
    const searchResponse = await Promise.race([searchPromise, timeoutPromise]);
    
    if (!searchResponse.results || !searchResponse.results.length) {
      return {
        query,
        hits: [],
      };
    }
    
    // Transform Exa search results into our standardized format
    const hits: Hit[] = searchResponse.results.map((result: any) => {
      return {
        title: result.title,
        url: result.url,
        snippet: result.text,
        date: result.publishedDate,
        highlights: result.highlights,
      };
    });
    
    console.log(`[EXA] Found ${hits.length} results for "${query}"`);
    
    return {
      query,
      hits,
    };
  } catch (error: any) {
    console.error(`[EXA] Error performing search:`, error);
    
    // Attempt to provide a more helpful error message
    const errorMessage = error.message || 'Unknown error occurred during search';
    
    // If this is a timeout error that we generated, pass it along
    if (error.status === 504) {
      throw error;
    }
    
    // Otherwise, create a new service unavailable error
    throw createError.serviceUnavailable(`Exa search failed: ${errorMessage}`, {
      query,
      domain,
    });
  }
} 