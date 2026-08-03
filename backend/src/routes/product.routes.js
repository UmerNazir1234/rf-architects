import { Router } from 'express';
import {
  getPublicProducts,
  getPublicProductBySlug,
  getRelatedProducts,
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  publishProduct,
  updateStock,
  deleteProduct,
  bulkUpdateProducts,
  duplicateProduct,
} from '../controllers/product.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

// ─── Public routes (no auth) ──────────────────────────────────────────────────
// NOTE: specific paths MUST come before the /:slug wildcard
router.get('/', getPublicProducts);
router.get('/:slug/related', getRelatedProducts);
router.get('/:slug', getPublicProductBySlug);

// ─── Admin routes (protected) ─────────────────────────────────────────────────
// Apply auth middleware to all routes below this line
router.use(authMiddleware);

// List & single — use /admin prefix to avoid collision with /:slug above
router.get('/admin/list', roleMiddleware('superadmin', 'editor', 'viewer'), getAdminProducts);
router.get('/admin/:id', roleMiddleware('superadmin', 'editor', 'viewer'), getAdminProductById);

// Bulk operations — must come before /:id to avoid slug match
router.post('/bulk', roleMiddleware('superadmin', 'editor'), bulkUpdateProducts);

// CRUD
router.post('/', roleMiddleware('superadmin', 'editor'), createProduct);
router.put('/:id', roleMiddleware('superadmin', 'editor'), updateProduct);
router.patch('/:id/publish', roleMiddleware('superadmin', 'editor'), publishProduct);
router.patch('/:id/stock', roleMiddleware('superadmin', 'editor'), updateStock);
router.post('/:id/duplicate', roleMiddleware('superadmin', 'editor'), duplicateProduct);
router.delete('/:id', roleMiddleware('superadmin'), deleteProduct);

export default router;
