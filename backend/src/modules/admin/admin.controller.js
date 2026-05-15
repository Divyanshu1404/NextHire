import * as adminService from './admin.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';

export const getCompanies = asyncHandler(async (req, res) => {
  const companies = await adminService.getAllCompanies();
  return sendSuccess(res, 'Companies retrieved', { companies });
});

export const updateKYC = asyncHandler(async (req, res) => {
  const company = await adminService.updateCompanyKYCStatus(req.params.companyId, req.body.status);
  return sendSuccess(res, `Company KYC status updated to ${company.verificationStatus}`, { company });
});
