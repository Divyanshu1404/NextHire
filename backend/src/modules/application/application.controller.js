import * as applicationService from './application.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { apiResponse } from '../../utils/apiResponse.js';

export const applyJob = asyncHandler(async (req, res) => {
  const application = await applicationService.applyForJob(req.body.jobId, req.user.id, req.body);
  apiResponse(res, 201, 'Applied successfully', { application });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const application = await applicationService.updateApplicationStatus(
    req.params.id, 
    req.body, 
    req.user.id, 
    req.user.role
  );
  apiResponse(res, 200, 'Application status updated', { application });
});

export const sendAssessment = asyncHandler(async (req, res) => {
  const application = await applicationService.sendAssessment(
    req.params.id,
    req.body.assessmentLink,
    req.user.id
  );
  apiResponse(res, 200, 'Assessment sent successfully', { application });
});

export const getApplications = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId?._id || req.user.companyId;
  const applications = await applicationService.getApplicationsForJob(req.params.jobId, companyId);
  apiResponse(res, 200, 'Applications retrieved', { applications });
});

export const getCompanyApplications = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId?._id || req.user.companyId;
  const applications = await applicationService.getCompanyApplications(companyId);
  apiResponse(res, 200, 'Company applications retrieved', { applications });
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await applicationService.getUserApplications(req.user.id);
  apiResponse(res, 200, 'My applications retrieved', { applications });
});
