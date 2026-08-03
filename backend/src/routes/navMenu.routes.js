import { Router } from 'express';
import {
  getPublicNavMenu,
  getAdminNavMenu,
  createNavMenuItem,
  updateNavMenuItem,
  reorderNavMenuItems,
  deleteNavMenuItem,
} from '../controllers/navMenu.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

// ─── Public routes (no auth) ──────────────────────────────────────────────────
// GET /nav-menus/:handle — returns resolved tree, active items only
router.get('/:handle', getPublicNavMenu);

// ─── Admin routes (protected) ─────────────────────────────────────────────────
router.use(authMiddleware);

// Full tree (including inactive items)
router.get('/:handle/admin', roleMiddleware('superadmin', 'editor', 'viewer'), getAdminNavMenu);

// Item CRUD + reorder
router.post('/:handle/items', roleMiddleware('superadmin', 'editor'), createNavMenuItem);
router.patch('/:handle/items/reorder', roleMiddleware('superadmin', 'editor'), reorderNavMenuItems);
router.put('/:handle/items/:id', roleMiddleware('superadmin', 'editor'), updateNavMenuItem);
router.delete('/:handle/items/:id', roleMiddleware('superadmin', 'editor'), deleteNavMenuItem);

export default router;
