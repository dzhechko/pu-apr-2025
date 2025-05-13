import { Router } from 'express';
import { planController } from '../controllers/plan.controller';

const router = Router();

/**
 * @route POST /api/plan
 * @desc Generate a research plan for a question
 * @access Public
 */
router.post('/', planController.createPlan);

/**
 * @route GET /api/plan/health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/health', planController.healthCheck);

export default router; 