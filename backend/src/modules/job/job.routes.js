import express from 'express';
import { createJob, getJobs, updateJob, deleteJob, getJob, getCompanyJobs, getPublicStats } from './job.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createJobSchema, updateJobSchema } from './job.validation.js';
import { logActivity } from '../../middleware/activity.middleware.js';
import { ROLES } from '../../constants/roles.js';

const router = express.Router();

// General jobs routes
router.get('/stats', getPublicStats);
router.route('/')
  .post(
    protect, 
    authorizeRoles(ROLES.RECRUITER, ROLES.COMPANY_ADMIN), 
    validate(createJobSchema), 
    logActivity('JOB_CREATED', (req) => `Created new job: ${req.body.title}`),
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
    logActivity('JOB_UPDATED', (req) => `Updated job: ${req.body.title || req.params.id}`),
    updateJob
  )
  .delete(
    protect, 
    authorizeRoles(ROLES.RECRUITER, ROLES.COMPANY_ADMIN), 
    logActivity('JOB_DELETED', (req) => `Deleted job ID: ${req.params.id}`),
    deleteJob
  );

export default router;
