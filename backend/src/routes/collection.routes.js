import { Router } from 'express';
import {
  getPublicCollections,
  getPublicCollectionBySlug,
  getAdminCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  previewCollection,
} from '../controllers/collection.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

// ─── Public routes (no auth) ──────────────────────────────────────────────────
// Specific paths BEFORE /:slug wildcard
router.get('/', getPublicCollections);
router.get('/:slug', getPublicCollectionBySlug);

// ─── Admin routes (protected) ─────────────────────────────────────────────────
router.use(authMiddleware);

// Use /admin prefix to prevent collision with public /:slug route
router.get('/admin/list', roleMiddleware('superadmin', 'editor', 'viewer'), getAdminCollections);

// CRUD
router.post('/', roleMiddleware('superadmin', 'editor'), createCollection);
router.put('/:id', roleMiddleware('superadmin', 'editor'), updateCollection);
router.post('/:id/preview', roleMiddleware('superadmin', 'editor'), previewCollection);
router.delete('/:id', roleMiddleware('superadmin'), deleteCollection);

export default router;
