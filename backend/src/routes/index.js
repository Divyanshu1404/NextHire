import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/user/user.routes.js';
import companyRoutes from '../modules/company/company.routes.js';
import jobRoutes from '../modules/job/job.routes.js';
import applicationRoutes from '../modules/application/application.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';
import uploadRoutes from '../modules/upload/upload.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/company', companyRoutes);
router.use('/jobs', jobRoutes);
router.use('/application', applicationRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);

export default router;
