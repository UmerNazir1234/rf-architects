import { Router } from 'express';
import {
  getPublicFaqs,
  getAdminFaqs,
  createFaq,
  updateFaq,
  publishFaq,
  reorderFaqs,
  deleteFaq,
} from '../controllers/faq.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

// Public routes
router.get('/', getPublicFaqs);

// Admin routes (protected)
router.use(authMiddleware);
router.get('/admin', roleMiddleware('superadmin', 'editor', 'viewer'), getAdminFaqs);
router.post('/', roleMiddleware('superadmin', 'editor'), createFaq);
router.put('/:id', roleMiddleware('superadmin', 'editor'), updateFaq);
router.patch('/:id/publish', roleMiddleware('superadmin', 'editor'), publishFaq);
router.patch('/reorder', roleMiddleware('superadmin', 'editor'), reorderFaqs);
router.delete('/:id', roleMiddleware('superadmin'), deleteFaq);

export default router;
