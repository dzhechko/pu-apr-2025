"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileController = void 0;
const openai_1 = require("../utils/openai");
const error_handler_1 = require("../../../shared/utils/error-handler");
/**
 * Controller for handling report compilation requests
 */
exports.compileController = {
    /**
     * Compile search results into a report
     */
    compileReport: (0, error_handler_1.asyncHandler)(async (req, res) => {
        const compileRequest = req.body;
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
        const reportMarkdown = await (0, openai_1.compileReport)(compileRequest);
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
    healthCheck: (0, error_handler_1.asyncHandler)(async (_req, res) => {
        return res.status(200).json({
            service: 'editor',
            status: 'ok',
            timestamp: new Date().toISOString(),
        });
    }),
};
