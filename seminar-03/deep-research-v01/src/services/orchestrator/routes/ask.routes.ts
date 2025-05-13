import { Router } from 'express';
import { askController } from '../controllers/ask.controller';

const router = Router();

/**
 * @route POST /api/ask
 * @desc Process a research request and return a report
 * @access Public
 */
router.post('/', askController.ask);

/**
 * @route GET /api/ask
 * @desc Process a research request via query parameters and return SSE updates
 * @access Public
 */
router.get('/', askController.ask);

/**
 * @route GET /api/ask/health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/health', askController.healthCheck);

export default router; 