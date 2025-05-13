import { Request, Response } from 'express';
import { searchInternet } from '../utils/exa';
import { searchStockPrice } from '../utils/serp';
import { asyncHandler } from '../../../shared/utils/error-handler';
import { SearchRequest, SearchResponse } from '../../../shared/types';
import config from '../../../shared/config';

/**
 * Detects if a query is likely asking for stock price information
 * This is a simple detection based on keywords and patterns
 */
function isStockPriceQuery(query: string): boolean {
  // Convert to lowercase for case-insensitive matching
  const lowerQuery = query.toLowerCase();
  
  // Keywords associated with stock prices
  const stockKeywords = [
    'stock price', 'share price', 'stock value', 'ticker',
    'акции', 'акция', 'курс акций', 'стоимость акций', // Russian keywords
    'stock market', 'stock quote', 'current price',
    'how much is', 'what is the price of', 'trading at',
  ];
  
  // Check if any keywords are in the query
  const hasStockKeywords = stockKeywords.some(keyword => lowerQuery.includes(keyword));
  
  // Check if query contains common company names AND price-related terms
  const companyNames = ['microsoft', 'apple', 'google', 'amazon', 'tesla', 'facebook', 'meta', 'netflix'];
  const priceTerms = ['price', 'worth', 'cost', 'value', 'trading', 'stock', 'сколько стоит', 'курс'];
  
  const hasCompanyAndPrice = 
    companyNames.some(company => lowerQuery.includes(company)) && 
    priceTerms.some(term => lowerQuery.includes(term));
  
  // Check for stock symbols (1-5 uppercase letters)
  const hasStockSymbol = /\b[A-Z]{1,5}\b/.test(query);
  
  return hasStockKeywords || hasCompanyAndPrice || hasStockSymbol;
}

/**
 * Controller for handling search requests to the Research Service
 */
export const searchController = {
  /**
   * Execute a search based on a PlanItem
   */
  search: asyncHandler(async (req: Request, res: Response) => {
    const searchRequest: SearchRequest = req.body;
    
    // Validate request
    if (!searchRequest.query || !searchRequest.domain) {
      return res.status(400).json({
        error: {
          message: 'Invalid search request. Query and domain are required.',
        },
      });
    }
    
    // Log the search request
    console.log(`[RESEARCH] Processing search for: "${searchRequest.query}" on domain: ${searchRequest.domain}`);
    
    // Check if this is a stock price query
    const isStockQuery = isStockPriceQuery(searchRequest.query);
    const isFinancialDomain = searchRequest.domain === 'financial' || searchRequest.domain === 'finance';
    
    let searchResults: SearchResponse;
    
    // Use SerpAPI for stock price queries
    if (isStockQuery && (isFinancialDomain || searchRequest.domain === 'general')) {
      console.log(`[RESEARCH] Detected stock price query, using SerpAPI: "${searchRequest.query}"`);
      
      // Use SerpAPI for real-time stock data
      searchResults = await searchStockPrice({
        query: searchRequest.query,
      });
    } else {
      // Use Exa for regular searches
      searchResults = await searchInternet({
        query: searchRequest.query,
        domain: searchRequest.domain,
        numResults: config.performance.maxResultsPerSearch,
      });
    }
    
    // Return the search results
    return res.status(200).json(searchResults);
  }),
  
  /**
   * Health check endpoint
   */
  healthCheck: asyncHandler(async (_req: Request, res: Response) => {
    return res.status(200).json({
      service: 'research',
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }),
}; 