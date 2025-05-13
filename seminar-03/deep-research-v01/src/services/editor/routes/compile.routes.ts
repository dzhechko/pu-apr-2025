import { Router } from 'express';
import { compileController } from '../controllers/compile.controller';

const router = Router();

/**
 * @route POST /api/compile
 * @desc Compile search results into a report
 * @access Public
 */
router.post('/', compileController.compileReport);

/**
 * @route GET /api/compile/health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/health', compileController.healthCheck);

export default router; 