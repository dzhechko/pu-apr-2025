"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controller_1 = require("../controllers/search.controller");
const router = (0, express_1.Router)();
/**
 * @route POST /api/search
 * @desc Execute a search based on a PlanItem
 * @access Public
 */
router.post('/', search_controller_1.searchController.search);
/**
 * @route GET /api/search/health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/health', search_controller_1.searchController.healthCheck);
exports.default = router;
