import { Router } from 'express';
import {
  getSettings,
  updateSettings,
} from '../controllers/settings.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

// Public routes (no auth)
router.get('/', getSettings);

// Admin routes (superadmin only)
router.use(authMiddleware);
router.put('/', roleMiddleware('superadmin'), updateSettings);

export default router;
