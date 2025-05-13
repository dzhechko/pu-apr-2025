"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ask_controller_1 = require("../controllers/ask.controller");
const router = (0, express_1.Router)();
/**
 * @route POST /api/ask
 * @desc Process a research request and return a report
 * @access Public
 */
router.post('/', ask_controller_1.askController.ask);
/**
 * @route GET /api/ask
 * @desc Process a research request via query parameters and return SSE updates
 * @access Public
 */
router.get('/', ask_controller_1.askController.ask);
/**
 * @route GET /api/ask/health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/health', ask_controller_1.askController.healthCheck);
exports.default = router;
