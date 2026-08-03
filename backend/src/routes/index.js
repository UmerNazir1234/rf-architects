import { Router } from 'express';
import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import collectionRoutes from './collection.routes.js';
import productRoutes from './product.routes.js';
import projectRoutes from './project.routes.js';
import faqRoutes from './faq.routes.js';
import siteStatRoutes from './siteStat.routes.js';
import userRoutes from './user.routes.js';
import settingsRoutes from './settings.routes.js';
import uploadRoutes from './upload.routes.js';
import navMenuRoutes from './navMenu.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/collections', collectionRoutes);
router.use('/products', productRoutes);
router.use('/projects', projectRoutes);
router.use('/faqs', faqRoutes);
router.use('/site-stats', siteStatRoutes);
router.use('/users', userRoutes);
router.use('/settings', settingsRoutes);
router.use('/uploads', uploadRoutes);
router.use('/nav-menus', navMenuRoutes);

export default router;
