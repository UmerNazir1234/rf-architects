import { Router } from 'express';
import {
  uploadImage,
  uploadImages,
  deleteImage,
  deleteImages,
} from '../controllers/upload.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

// All upload routes require auth (editor+)
router.use(authMiddleware);

// Single image
router.post('/image', roleMiddleware('superadmin', 'editor'), upload.single('image'), uploadImage);
router.delete('/image', roleMiddleware('superadmin', 'editor'), deleteImage);

// Multi-image (new — used by product image uploader)
router.post('/images', roleMiddleware('superadmin', 'editor'), upload.array('images', 10), uploadImages);
router.delete('/images', roleMiddleware('superadmin', 'editor'), deleteImages);

export default router;
