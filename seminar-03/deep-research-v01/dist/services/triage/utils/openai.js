"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResearchPlan = generateResearchPlan;
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("../../../shared/config"));
const error_handler_1 = require("../../../shared/utils/error-handler");
// Initialize OpenAI client
const openai = new openai_1.default({
    apiKey: config_1.default.api.openai.apiKey,
});
/**
 * Generate a research plan for a question
 */
async function generateResearchPlan(request) {
    try {
        console.log(`[TRIAGE] Generating research plan for: "${request.question}"`);
        // Set up the system prompt
        const systemPrompt = `
You are a research triage agent.  
User Question: "${request.question}"  

Task: Break this question into a JSON plan: an array of sub-queries with fields  
• id (1-based number),  
• query (what to search),  
• domain (e.g. "wikipedia.org", "news", "technical", "academic", "general"),  
• priority (1=high, 3=low).  

Generate 2-5 sub-queries that together will help answer the main question comprehensively.
Choose appropriate domains for each sub-query based on its nature.
Assign priorities to ensure the most crucial queries are executed first.

EXAMPLES:
For "What are the key differences between REST and GraphQL?":
{
  "plan": [
    { "id": 1, "query": "REST API vs GraphQL key differences", "domain": "technical", "priority": 1 },
    { "id": 2, "query": "GraphQL advantages and disadvantages", "domain": "technical", "priority": 2 },
    { "id": 3, "query": "REST API performance compared to GraphQL", "domain": "technical", "priority": 2 },
    { "id": 4, "query": "When to use REST vs GraphQL case studies", "domain": "technical", "priority": 3 }
  ]
}

Return a valid JSON object with a "plan" key containing an array of queries, with no additional text.
`;
        // Make the OpenAI request
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: request.question }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
        });
        // Extract the completion text
        const responseText = completion.choices[0]?.message?.content;
        if (!responseText) {
            throw error_handler_1.createError.internalServerError('Failed to generate research plan: empty response');
        }
        // Parse the JSON response
        try {
            const plan = JSON.parse(responseText);
            // Validate the response structure
            if (!plan.plan || !Array.isArray(plan.plan)) {
                throw error_handler_1.createError.internalServerError('Invalid research plan format: missing or invalid plan array');
            }
            // Validate each plan item
            plan.plan.forEach((item) => {
                if (!item.id || !item.query || !item.domain || !item.priority) {
                    throw error_handler_1.createError.internalServerError('Invalid research plan item: missing required fields');
                }
            });
            console.log(`[TRIAGE] Generated plan with ${plan.plan.length} queries`);
            return plan;
        }
        catch (parseError) {
            console.error('[TRIAGE] Error parsing research plan:', parseError);
            throw error_handler_1.createError.internalServerError('Failed to parse research plan JSON response');
        }
    }
    catch (error) {
        console.error('[TRIAGE] Error generating research plan:', error);
        if (error.status) {
            // If it's already an ApiError from createError, pass it along
            throw error;
        }
        // Otherwise, wrap it in a service unavailable error
        throw error_handler_1.createError.serviceUnavailable(`OpenAI error: ${error.message}`);
    }
}
