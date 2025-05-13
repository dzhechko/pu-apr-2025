"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchInternet = searchInternet;
const exa_js_1 = __importDefault(require("exa-js"));
const config_1 = __importDefault(require("../../../shared/config"));
const error_handler_1 = require("../../../shared/utils/error-handler");
// Initialize Exa client with API key
const exa = new exa_js_1.default(config_1.default.api.exa.apiKey);
/**
 * Search the internet using Exa API
 * Based on the Langbase example: https://langbase.com/docs/examples/internet-research-tool
 */
async function searchInternet({ query, domain, numResults = config_1.default.performance.maxResultsPerSearch, useAutoprompt = false, }) {
    try {
        console.log(`[EXA] Searching for: "${query}" in domain: ${domain}`);
        // Set up a timeout for the search request
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(error_handler_1.createError.timeoutError(`Search request timed out after ${config_1.default.performance.searchTimeoutMs}ms`));
            }, config_1.default.performance.searchTimeoutMs);
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
        const hits = searchResponse.results.map((result) => {
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
    }
    catch (error) {
        console.error(`[EXA] Error performing search:`, error);
        // Attempt to provide a more helpful error message
        const errorMessage = error.message || 'Unknown error occurred during search';
        // If this is a timeout error that we generated, pass it along
        if (error.status === 504) {
            throw error;
        }
        // Otherwise, create a new service unavailable error
        throw error_handler_1.createError.serviceUnavailable(`Exa search failed: ${errorMessage}`, {
            query,
            domain,
        });
    }
}
