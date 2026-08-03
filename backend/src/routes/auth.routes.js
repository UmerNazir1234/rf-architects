import { Router } from 'express';
import {
  login,
  logout,
  getCurrentUser,
  refreshToken,
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { loginLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

// Public routes
router.post('/login', loginLimiter, login);
router.post('/refresh', refreshToken);

// Protected routes
router.use(authMiddleware);
router.post('/logout', logout);
router.get('/me', getCurrentUser);

export default router;
