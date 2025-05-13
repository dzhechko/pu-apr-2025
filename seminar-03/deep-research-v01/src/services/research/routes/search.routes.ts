import { Router } from 'express';
import { searchController } from '../controllers/search.controller';

const router = Router();

/**
 * @route POST /api/search
 * @desc Execute a search based on a PlanItem
 * @access Public
 */
router.post('/', searchController.search);

/**
 * @route GET /api/search/health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/health', searchController.healthCheck);

export default router; 