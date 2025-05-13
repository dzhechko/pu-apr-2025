"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchController = void 0;
const exa_1 = require("../utils/exa");
const error_handler_1 = require("../../../shared/utils/error-handler");
const config_1 = __importDefault(require("../../../shared/config"));
/**
 * Controller for handling search requests to the Research Service
 */
exports.searchController = {
    /**
     * Execute a search based on a PlanItem
     */
    search: (0, error_handler_1.asyncHandler)(async (req, res) => {
        const searchRequest = req.body;
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
        // Execute the search
        const searchResults = await (0, exa_1.searchInternet)({
            query: searchRequest.query,
            domain: searchRequest.domain,
            numResults: config_1.default.performance.maxResultsPerSearch,
        });
        // Return the search results
        return res.status(200).json(searchResults);
    }),
    /**
     * Health check endpoint
     */
    healthCheck: (0, error_handler_1.asyncHandler)(async (_req, res) => {
        return res.status(200).json({
            service: 'research',
            status: 'ok',
            timestamp: new Date().toISOString(),
        });
    }),
};
