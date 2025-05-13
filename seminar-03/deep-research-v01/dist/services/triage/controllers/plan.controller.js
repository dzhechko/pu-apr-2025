"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planController = void 0;
const openai_1 = require("../utils/openai");
const error_handler_1 = require("../../../shared/utils/error-handler");
/**
 * Controller for handling research plan generation requests
 */
exports.planController = {
    /**
     * Generate a research plan for a question
     */
    createPlan: (0, error_handler_1.asyncHandler)(async (req, res) => {
        const planRequest = req.body;
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
        const planResponse = await (0, openai_1.generateResearchPlan)(planRequest);
        // Return the plan
        return res.status(200).json(planResponse);
    }),
    /**
     * Health check endpoint
     */
    healthCheck: (0, error_handler_1.asyncHandler)(async (_req, res) => {
        return res.status(200).json({
            service: 'triage',
            status: 'ok',
            timestamp: new Date().toISOString(),
        });
    }),
};
