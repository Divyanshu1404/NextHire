import * as applicationService from './application.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';

export const applyJob = asyncHandler(async (req, res) => {
  const application = await applicationService.applyForJob(req.body.jobId, req.user.id, req.body);
  return sendSuccess(res, 'Applied successfully', { application }, 201);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const application = await applicationService.updateApplicationStatus(
    req.params.id, 
    req.body, 
    req.user.id, 
    req.user.role
  );
  return sendSuccess(res, 'Application status updated', { application });
});

export const sendAssessment = asyncHandler(async (req, res) => {
  const application = await applicationService.sendAssessment(
    req.params.id,
    req.body.assessmentLink,
    req.user.id
  );
  return sendSuccess(res, 'Assessment sent successfully', { application });
});

export const getApplications = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId?._id || req.user.companyId;
  const applications = await applicationService.getApplicationsForJob(req.params.jobId, companyId);
  return sendSuccess(res, 'Applications retrieved', { applications });
});

export const getCompanyApplications = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId?._id || req.user.companyId;
  const applications = await applicationService.getCompanyApplications(companyId);
  return sendSuccess(res, 'Company applications retrieved', { applications });
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await applicationService.getUserApplications(req.user.id);
  return sendSuccess(res, 'My applications retrieved', { applications });
});
