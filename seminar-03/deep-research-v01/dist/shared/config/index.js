"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
// Get environment variable or use default
const getEnv = (key, defaultValue) => {
    const value = process.env[key];
    if (!value) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Environment variable ${key} is required but not set.`);
    }
    return value;
};
// Get numeric environment variable or use default
const getNumericEnv = (key, defaultValue) => {
    const value = process.env[key];
    if (!value) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Environment variable ${key} is required but not set.`);
    }
    return parseInt(value, 10);
};
// Export configuration for use across services
const config = {
    nodeEnv: getEnv('NODE_ENV', 'development'),
    isProduction: getEnv('NODE_ENV', 'development') === 'production',
    isDevelopment: getEnv('NODE_ENV', 'development') === 'development',
    services: {
        triage: {
            port: getNumericEnv('TRIAGE_SERVICE_PORT', 3001),
            url: getEnv('TRIAGE_SERVICE_URL', 'http://localhost:3001'),
        },
        research: {
            port: getNumericEnv('RESEARCH_SERVICE_PORT', 3002),
            url: getEnv('RESEARCH_SERVICE_URL', 'http://localhost:3002'),
        },
        editor: {
            port: getNumericEnv('EDITOR_SERVICE_PORT', 3003),
            url: getEnv('EDITOR_SERVICE_URL', 'http://localhost:3003'),
        },
        orchestrator: {
            port: getNumericEnv('ORCHESTRATOR_SERVICE_PORT', 3000),
            url: getEnv('ORCHESTRATOR_SERVICE_URL', 'http://localhost:3000'),
        },
    },
    api: {
        exa: {
            apiKey: getEnv('EXA_API_KEY', ''),
        },
        openai: {
            apiKey: getEnv('OPENAI_API_KEY', ''),
        },
        langbase: {
            apiKey: getEnv('LANGBASE_API_KEY', ''),
        },
    },
    performance: {
        maxConcurrentSearches: getNumericEnv('MAX_CONCURRENT_SEARCHES', 5),
        searchTimeoutMs: getNumericEnv('SEARCH_TIMEOUT_MS', 5000),
        maxResultsPerSearch: getNumericEnv('MAX_RESULTS_PER_SEARCH', 5),
        totalReportTimeoutMs: getNumericEnv('TOTAL_REPORT_TIMEOUT_MS', 25000),
    },
};
exports.default = config;
