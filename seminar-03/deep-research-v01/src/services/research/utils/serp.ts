import axios from 'axios';
import config from '../../../shared/config';
import { Hit, SearchResponse } from '../../../shared/types';
import { createError } from '../../../shared/utils/error-handler';

interface SerpApiParams {
  query: string;
  engine?: string;
}

/**
 * Search for real-time stock price data using SerpAPI
 * This is specifically optimized for financial/stock queries
 */
export async function searchStockPrice({
  query,
  engine = 'google_finance',
}: SerpApiParams): Promise<SearchResponse> {
  try {
    console.log(`[SERP] Searching for stock price: "${query}" using ${engine}`);
    console.log(`[SERP] Using API key: ${config.api.serpapi.apiKey ? 'configured' : 'missing'}`);
    
    // Set up a timeout for the search request
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(createError.timeoutError(`SerpAPI request timed out after ${config.performance.searchTimeoutMs}ms`));
      }, config.performance.searchTimeoutMs);
    });

    // Extract potential stock ticker from the query
    const stockRegex = /\b([A-Z]{1,5})\b/g;
    const potentialSymbols = [...query.matchAll(stockRegex)].map(match => match[1]);
    console.log(`[SERP] Potential stock symbols extracted: ${potentialSymbols.length > 0 ? potentialSymbols.join(', ') : 'none'}`);
    
    // Build the search parameters
    const searchParams: Record<string, string> = {
      engine: engine,
      api_key: config.api.serpapi.apiKey,
    };
    
    // If a potential stock symbol was found, use it as the query
    // According to SerpAPI docs, best format for a stock is TICKER:EXCHANGE
    // but we'll just use TICKER and let SerpAPI handle it
    if (potentialSymbols.length > 0 && potentialSymbols[0] !== undefined) {
      searchParams.q = potentialSymbols[0];
    } else {
      // Otherwise use the full query
      searchParams.q = query;
    }
    
    console.log(`[SERP] Request parameters: engine=${searchParams.engine}, q=${searchParams.q}`);
    
    try {
      // Make the request to SerpAPI
      const searchPromise = axios.get('https://serpapi.com/search', {
        params: searchParams,
        timeout: config.performance.searchTimeoutMs
      });
      
      // Race the search promise against the timeout
      const response = await Promise.race([searchPromise, timeoutPromise]);
      
      // Process the results
      const serpApiResponse = response.data;
      
      // Debug the response structure
      console.log(`[SERP] SerpAPI response received: ${serpApiResponse ? 'success' : 'empty'}`);
      // Log the keys of the response to understand the structure
      console.log(`[SERP] Response keys: ${Object.keys(serpApiResponse).join(', ')}`);
      
      // Check if there's an error from SerpAPI
      if (serpApiResponse.error) {
        console.error(`[ERROR] SerpAPI search failed: ${serpApiResponse.error}`);
        throw createError.serviceUnavailable(`SerpAPI search failed: ${serpApiResponse.error}`, {
          query,
          engine
        });
      }
      
      const hits: Hit[] = [];
      
      // Check for futures_chain - this contains the actual stock listing
      if (serpApiResponse.futures_chain && serpApiResponse.futures_chain.length > 0) {
        console.log(`[SERP] Found futures_chain data with ${serpApiResponse.futures_chain.length} items`);
        
        // First, look for NASDAQ listing as it's the most commonly referenced for US stocks
        const nasdaqItem = serpApiResponse.futures_chain.find((item: any) => 
          item.stock && item.stock.includes(':NASDAQ')
        );
        
        if (nasdaqItem) {
          console.log(`[SERP] Found NASDAQ listing: ${nasdaqItem.stock} - ${nasdaqItem.price}`);
          // Create a NASDAQ hit and put it first in the array
          hits.push({
            title: `${nasdaqItem.date || 'Stock Price'} (${nasdaqItem.stock})`,
            snippet: `Current price: ${nasdaqItem.price}`,
            url: nasdaqItem.link || `https://www.google.com/finance/quote/${nasdaqItem.stock}`,
            date: new Date().toISOString(),
            highlights: [
              `Current price: ${nasdaqItem.price}`,
              nasdaqItem.price_movement ? `${nasdaqItem.price_movement.movement || ''} ${nasdaqItem.price_movement.percentage}%` : ''
            ].filter(h => h)
          });
        }
        
        // Then process all other exchanges
        serpApiResponse.futures_chain.forEach((item: any, index: number) => {
          // Skip if this is the NASDAQ item we already processed
          if (item.stock && item.price && !(item.stock.includes(':NASDAQ') && hits.length > 0)) {
            console.log(`[SERP] Processing futures_chain item ${index}: ${item.stock} - ${item.price}`);
            hits.push({
              title: `${item.date || 'Stock Price'} (${item.stock})`,
              snippet: `Current price: ${item.price}`,
              url: item.link || `https://www.google.com/finance/quote/${item.stock}`,
              date: new Date().toISOString(),
              highlights: [
                `Current price: ${item.price}`,
                item.price_movement ? `${item.price_movement.movement || ''} ${item.price_movement.percentage}%` : ''
              ].filter(h => h) // Filter out empty strings
            });
          }
        });
      }
      
      // If we have a summary section, that contains the current stock price (fallback)
      if (hits.length === 0 && serpApiResponse.summary) {
        const { title, stock, exchange, price } = serpApiResponse.summary;
        
        console.log(`[SERP] Found summary data: ${stock} at ${price}`);
        hits.push({
          title: `${title || stock} (${stock})`,
          snippet: `Current price: ${price}`,
          url: `https://www.google.com/finance/quote/${stock}:${exchange}`,
          date: new Date().toISOString(),
          highlights: [
            `Current price: ${price}`
          ]
        });
        
        // Add market info if available
        if (serpApiResponse.summary.market && serpApiResponse.summary.market.price_movement) {
          const { percentage, movement } = serpApiResponse.summary.market.price_movement;
          // Check that we have at least one hit and it has highlights array
          if (hits.length > 0 && hits[0].highlights) {
            hits[0].highlights.push(`${movement} ${percentage}%`);
          }
        }
      }
      
      // Check for discover_more section which often contains related stocks
      if (hits.length === 0 && serpApiResponse.discover_more) {
        console.log(`[SERP] Found discover_more sections: ${serpApiResponse.discover_more.length}`);
        
        // Loop through each section
        serpApiResponse.discover_more.forEach((section: any) => {
          if (section.items) {
            // First look for NASDAQ listing
            const nasdaqItems = section.items.filter((item: any) => {
              const stockInfo = item.stock && item.stock.split(':');
              return stockInfo.length === 2 && stockInfo[0] === searchParams.q && stockInfo[1] === 'NASDAQ';
            });
            
            if (nasdaqItems.length > 0) {
              const item = nasdaqItems[0];
              console.log(`[SERP] Found NASDAQ listing in discover_more: ${item.stock} - ${item.price}`);
              
              hits.push({
                title: `${item.name || 'Stock'} (${item.stock})`,
                snippet: `Current price: ${item.price}`,
                url: item.link || `https://www.google.com/finance/quote/${item.stock}`,
                date: new Date().toISOString(),
                highlights: [
                  `Current price: ${item.price}`,
                  item.price_movement ? `${item.price_movement.movement || ''} ${item.price_movement.percentage}%` : ''
                ].filter(h => h)
              });
            }
            
            // If no NASDAQ, look for any match
            if (hits.length === 0) {
              const matchingItems = section.items.filter((item: any) => {
                const stockSymbol = item.stock && item.stock.split(':')[0];
                return stockSymbol === searchParams.q;
              });
              
              if (matchingItems.length > 0) {
                const item = matchingItems[0];
                console.log(`[SERP] Found matching stock in discover_more: ${item.stock} - ${item.price}`);
                
                hits.push({
                  title: `${item.name || 'Stock'} (${item.stock})`,
                  snippet: `Current price: ${item.price}`,
                  url: item.link || `https://www.google.com/finance/quote/${item.stock}`,
                  date: new Date().toISOString(),
                  highlights: [
                    `Current price: ${item.price}`,
                    item.price_movement ? `${item.price_movement.movement || ''} ${item.price_movement.percentage}%` : ''
                  ].filter(h => h)
                });
              }
            }
          }
        });
      }
      
      // If no specific stock data was found, provide a fallback
      if (hits.length === 0) {
        console.log(`[SERP] No specific stock data found in the response, using fallback`);
        
        hits.push({
          title: `${searchParams.q} Stock Price Information`,
          snippet: `We couldn't find specific price data for ${searchParams.q}. Try checking an official financial source for the current price.`,
          url: `https://www.google.com/finance/quote/${searchParams.q}`,
          date: new Date().toISOString(),
          highlights: ['No specific price data found']
        });
      }
      
      return {
        query,
        hits
      };
    } catch (error) {
      // For specific SerpAPI errors, provide a better fallback
      console.error(`[SERP] SerpAPI request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Provide a fallback response with static data
      return {
        query,
        hits: [{
          title: `${searchParams.q} Stock Price (Estimated)`,
          snippet: `We couldn't retrieve real-time data for ${searchParams.q} due to connectivity issues. Please check an official financial source for the current price.`,
          url: `https://www.google.com/finance/quote/${searchParams.q}`,
          date: new Date().toISOString(),
          highlights: ['Estimated data', 'Service connectivity issue']
        }]
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[ERROR] SerpAPI search failed: ${error.message}`, error);
      throw createError.serviceUnavailable(`SerpAPI search failed: ${error.message}`, {
        query,
        engine
      });
    }
    throw error;
  }
} 