import { Router } from 'express';
import {
  getSiteStats,
  updateSiteStat,
} from '../controllers/siteStat.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

// Public routes (no auth)
router.get('/', getSiteStats);

// Admin routes (protected)
router.use(authMiddleware);
router.put('/:key', roleMiddleware('superadmin', 'editor'), updateSiteStat);

export default router;
