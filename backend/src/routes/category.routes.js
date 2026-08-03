import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from '../controllers/category.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

// Public routes (no auth)
router.get('/', getCategories);

// Admin routes (protected)
router.use(authMiddleware);
router.post('/', roleMiddleware('superadmin', 'editor'), createCategory);
router.put('/:id', roleMiddleware('superadmin', 'editor'), updateCategory);
router.patch('/reorder', roleMiddleware('superadmin', 'editor'), reorderCategories);
router.delete('/:id', roleMiddleware('superadmin'), deleteCategory);

export default router;
