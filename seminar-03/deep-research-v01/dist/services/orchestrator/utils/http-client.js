"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpClient = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../../shared/config"));
const error_handler_1 = require("../../../shared/utils/error-handler");
/**
 * HTTP client for communicating with other services
 */
exports.httpClient = {
    /**
     * Send a request to the Triage service
     */
    triage: {
        /**
         * Generate a research plan for a question
         */
        createPlan: async (question) => {
            try {
                const response = await axios_1.default.post(`${config_1.default.services.triage.url}/api/plan`, { question }, {
                    timeout: config_1.default.performance.totalReportTimeoutMs / 3, // Allocate 1/3 of total time for triage
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                return response.data;
            }
            catch (error) {
                console.error('[ORCHESTRATOR] Error calling Triage service:', error);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    throw error_handler_1.createError.serviceUnavailable(`Triage service error: ${error.response.data?.error?.message || error.message}`);
                }
                else if (error.request) {
                    // The request was made but no response was received
                    throw error_handler_1.createError.serviceUnavailable('Triage service unavailable');
                }
                else {
                    // Something happened in setting up the request that triggered an Error
                    throw error_handler_1.createError.internalServerError(`Error setting up request to Triage service: ${error.message}`);
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
        search: async (searchRequest) => {
            try {
                const response = await axios_1.default.post(`${config_1.default.services.research.url}/api/search`, searchRequest, {
                    timeout: config_1.default.performance.searchTimeoutMs * 2, // Double the timeout for research queries
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                return response.data;
            }
            catch (error) {
                console.error('[ORCHESTRATOR] Error calling Research service:', error);
                if (error.response) {
                    throw error_handler_1.createError.serviceUnavailable(`Research service error: ${error.response.data?.error?.message || error.message}`);
                }
                else if (error.request) {
                    throw error_handler_1.createError.serviceUnavailable('Research service unavailable');
                }
                else {
                    throw error_handler_1.createError.internalServerError(`Error setting up request to Research service: ${error.message}`);
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
        compileReport: async (compileRequest) => {
            try {
                const response = await axios_1.default.post(`${config_1.default.services.editor.url}/api/compile`, compileRequest, {
                    timeout: config_1.default.performance.totalReportTimeoutMs / 2, // Allocate 1/2 of total time for editor (increased from 1/3)
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    maxContentLength: 10 * 1024 * 1024, // Allow for larger responses (10MB)
                    maxBodyLength: 10 * 1024 * 1024, // Allow for larger requests (10MB)
                });
                return response.data;
            }
            catch (error) {
                console.error('[ORCHESTRATOR] Error calling Editor service:', error);
                if (error.response) {
                    throw error_handler_1.createError.serviceUnavailable(`Editor service error: ${error.response.data?.error?.message || error.message}`);
                }
                else if (error.request) {
                    throw error_handler_1.createError.serviceUnavailable('Editor service unavailable');
                }
                else {
                    throw error_handler_1.createError.internalServerError(`Error setting up request to Editor service: ${error.message}`);
                }
            }
        },
    },
};
