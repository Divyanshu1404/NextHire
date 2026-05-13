import * as jobService from './job.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { apiResponse } from '../../utils/apiResponse.js';
import { Job } from '../../models/job.model.js';
import { Company } from '../../models/company.model.js';
import { User } from '../../models/user.model.js';
import { ROLES } from '../../constants/roles.js';
import { COMPANY_VERIFICATION_STATUS } from '../../constants/status.js';

// Helper: companyId can be a populated object or plain ID
const getCompanyId = (user) => user.companyId?._id || user.companyId;

export const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.body, req.user.id, getCompanyId(req.user));
  apiResponse(res, 201, 'Job created successfully', { job });
});

export const getJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.getJobs(req.query);
  apiResponse(res, 200, 'Jobs retrieved successfully', { jobs });
});

export const getJob = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  apiResponse(res, 200, 'Job retrieved successfully', { job });
});

export const updateJob = asyncHandler(async (req, res) => {
  const isSuperAdmin = req.user.role === ROLES.SUPER_ADMIN;
  const isCompanyAdmin = req.user.role === ROLES.COMPANY_ADMIN;
  const job = await jobService.updateJob(req.params.id, req.body, getCompanyId(req.user), req.user.id, isSuperAdmin, isCompanyAdmin);
  apiResponse(res, 200, 'Job updated successfully', { job });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const isSuperAdmin = req.user.role === ROLES.SUPER_ADMIN;
  const isCompanyAdmin = req.user.role === ROLES.COMPANY_ADMIN;
  await jobService.deleteJob(req.params.id, getCompanyId(req.user), req.user.id, isSuperAdmin, isCompanyAdmin);
  apiResponse(res, 200, 'Job deleted successfully');
});

export const getCompanyJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.getJobsByCompany(getCompanyId(req.user));
  apiResponse(res, 200, 'Company jobs retrieved successfully', { jobs });
});

export const getPublicStats = asyncHandler(async (req, res) => {
  const [jobCount, companyCount, candidateCount] = await Promise.all([
    Job.countDocuments(),
    Company.countDocuments(),
    User.countDocuments()
  ]);

  apiResponse(res, 200, 'Public stats retrieved successfully', {
    jobs: jobCount,
    companies: companyCount,
    candidates: candidateCount
  });
});




