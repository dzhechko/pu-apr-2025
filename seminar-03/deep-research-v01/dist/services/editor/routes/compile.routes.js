"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const compile_controller_1 = require("../controllers/compile.controller");
const router = (0, express_1.Router)();
/**
 * @route POST /api/compile
 * @desc Compile search results into a report
 * @access Public
 */
router.post('/', compile_controller_1.compileController.compileReport);
/**
 * @route GET /api/compile/health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/health', compile_controller_1.compileController.healthCheck);
exports.default = router;
