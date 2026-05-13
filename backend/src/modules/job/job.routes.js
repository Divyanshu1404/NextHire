import express from 'express';
import { createJob, getJobs, updateJob, deleteJob, getJob, getCompanyJobs, getPublicStats } from './job.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createJobSchema, updateJobSchema } from './job.validation.js';
import { ROLES } from '../../constants/roles.js';

const router = express.Router();

// General jobs routes
router.get('/stats', getPublicStats);
router.route('/')
  .post(
    protect, 
    authorizeRoles(ROLES.RECRUITER, ROLES.COMPANY_ADMIN), 
    validate(createJobSchema), 
    createJob
  )
  .get(getJobs);

// Company specific jobs (Unique path)
router.get(
  '/get/company-jobs', 
  protect, 
  authorizeRoles(ROLES.RECRUITER, ROLES.COMPANY_ADMIN, ROLES.HR), 
  getCompanyJobs
);

// Job by ID routes
router.route('/:id')
  .get(getJob)
  .put(
    protect, 
    authorizeRoles(ROLES.RECRUITER, ROLES.COMPANY_ADMIN), 
    validate(updateJobSchema), 
    updateJob
  )
  .delete(
    protect, 
    authorizeRoles(ROLES.RECRUITER, ROLES.COMPANY_ADMIN), 
    deleteJob
  );

export default router;
