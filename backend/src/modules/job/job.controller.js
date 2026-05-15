import * as jobService from './job.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import { ROLES } from '../../constants/roles.js';
import * as jobRepository from '../../repositories/job.repository.js';
import * as companyRepository from '../../repositories/company.repository.js';
import * as userRepository from '../../repositories/user.repository.js';

// Helper: companyId can be a populated object or plain ID
const getCompanyId = (user) => user.companyId?._id || user.companyId;

export const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.body, req.user.id, getCompanyId(req.user));
  return sendSuccess(res, 'Job created successfully', { job }, 201);
});

export const getJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.getJobs(req.query);
  return sendSuccess(res, 'Jobs retrieved successfully', { jobs });
});

export const getJob = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  return sendSuccess(res, 'Job retrieved successfully', { job });
});

export const updateJob = asyncHandler(async (req, res) => {
  const isSuperAdmin = req.user.role === ROLES.SUPER_ADMIN;
  const isCompanyAdmin = req.user.role === ROLES.COMPANY_ADMIN;
  const job = await jobService.updateJob(req.params.id, req.body, getCompanyId(req.user), req.user.id, isSuperAdmin, isCompanyAdmin);
  return sendSuccess(res, 'Job updated successfully', { job });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const isSuperAdmin = req.user.role === ROLES.SUPER_ADMIN;
  const isCompanyAdmin = req.user.role === ROLES.COMPANY_ADMIN;
  await jobService.deleteJob(req.params.id, getCompanyId(req.user), req.user.id, isSuperAdmin, isCompanyAdmin);
  return sendSuccess(res, 'Job deleted successfully');
});

export const getCompanyJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.getJobsByCompany(getCompanyId(req.user));
  return sendSuccess(res, 'Company jobs retrieved successfully', { jobs });
});

export const getPublicStats = asyncHandler(async (req, res) => {
  const [jobCount, companyCount, candidateCount] = await Promise.all([
    jobRepository.countDocuments(),
    companyRepository.countDocuments(),
    userRepository.countDocuments()
  ]);

  return sendSuccess(res, 'Public stats retrieved successfully', {
    jobs: jobCount,
    companies: companyCount,
    candidates: candidateCount
  });
});




