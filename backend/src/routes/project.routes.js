import { Router } from 'express';
import {
  getPublicProjects,
  getPublicProjectBySlug,
  getAdminProjects,
  createProject,
  updateProject,
  publishProject,
  reorderProjects,
  deleteProject,
} from '../controllers/project.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

// Public routes — specific paths must come before /:slug wildcard
router.get('/', getPublicProjects);
router.get('/:slug', getPublicProjectBySlug);

// Admin routes (protected)
router.use(authMiddleware);
router.get('/admin/list', roleMiddleware('superadmin', 'editor', 'viewer'), getAdminProjects);
router.post('/', roleMiddleware('superadmin', 'editor'), createProject);
router.put('/:id', roleMiddleware('superadmin', 'editor'), updateProject);
router.patch('/:id/publish', roleMiddleware('superadmin', 'editor'), publishProject);
router.patch('/reorder', roleMiddleware('superadmin', 'editor'), reorderProjects);
router.delete('/:id', roleMiddleware('superadmin'), deleteProject);

export default router;
