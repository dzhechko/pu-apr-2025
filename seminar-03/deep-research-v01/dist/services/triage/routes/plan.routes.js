"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const plan_controller_1 = require("../controllers/plan.controller");
const router = (0, express_1.Router)();
/**
 * @route POST /api/plan
 * @desc Generate a research plan for a question
 * @access Public
 */
router.post('/', plan_controller_1.planController.createPlan);
/**
 * @route GET /api/plan/health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/health', plan_controller_1.planController.healthCheck);
exports.default = router;
