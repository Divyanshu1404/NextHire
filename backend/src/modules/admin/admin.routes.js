import express from 'express';
import { getCompanies, updateKYC } from './admin.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/role.middleware.js';
import { ROLES } from '../../constants/roles.js';

const router = express.Router();


router.use(protect, authorizeRoles(ROLES.SUPER_ADMIN));

router.get('/companies', getCompanies);
router.put('/companies/:companyId/kyc', updateKYC);

export default router;
