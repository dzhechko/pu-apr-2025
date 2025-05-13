"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const plan_routes_1 = __importDefault(require("./routes/plan.routes"));
const error_handler_1 = require("../../shared/utils/error-handler");
const config_1 = __importDefault(require("../../shared/config"));
// Create Express server
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// API Routes
app.use('/api/plan', plan_routes_1.default);
// Error handling middleware
app.use(error_handler_1.errorHandler);
// Start server
const PORT = config_1.default.services.triage.port;
app.listen(PORT, () => {
    console.log(`[TRIAGE] Triage Service running on port ${PORT}`);
    console.log(`[TRIAGE] OpenAI API Key configured: ${!!config_1.default.api.openai.apiKey}`);
});
exports.default = app;
