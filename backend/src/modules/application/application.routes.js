import express from 'express';
import { applyJob, updateStatus, getApplications, getMyApplications, sendAssessment, getCompanyApplications } from './application.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { applyJobSchema, updateApplicationStatusSchema } from './application.validation.js';
import { ROLES } from '../../constants/roles.js';

const router = express.Router();

router.post(
  '/', 
  protect, 
  authorizeRoles(ROLES.USER), 
  validate(applyJobSchema), 
  applyJob
);

router.get(
  '/my-applications',
  protect,
  authorizeRoles(ROLES.USER),
  getMyApplications
);

router.put(
  '/:id/status', 
  protect, 
  authorizeRoles(ROLES.HR, ROLES.MANAGER, ROLES.COMPANY_ADMIN, ROLES.RECRUITER), 
  validate(updateApplicationStatusSchema), 
  updateStatus
);

router.post(
  '/:id/assessment',
  protect,
  authorizeRoles(ROLES.HR, ROLES.MANAGER, ROLES.COMPANY_ADMIN, ROLES.RECRUITER),
  sendAssessment
);

router.get(
  '/job/:jobId', 
  protect, 
  authorizeRoles(ROLES.HR, ROLES.MANAGER, ROLES.RECRUITER, ROLES.COMPANY_ADMIN), 
  getApplications
);

router.get(
  '/get/company-applications',
  protect,
  authorizeRoles(ROLES.HR, ROLES.MANAGER, ROLES.RECRUITER, ROLES.COMPANY_ADMIN),
  getCompanyApplications
);

export default router;
