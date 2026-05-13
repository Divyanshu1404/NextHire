import * as adminService from './admin.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { apiResponse } from '../../utils/apiResponse.js';

export const getCompanies = asyncHandler(async (req, res) => {
  const companies = await adminService.getAllCompanies();
  apiResponse(res, 200, 'Companies retrieved', { companies });
});

export const updateKYC = asyncHandler(async (req, res) => {
  const company = await adminService.updateCompanyKYCStatus(req.params.companyId, req.body.status);
  apiResponse(res, 200, `Company KYC status updated to ${company.verificationStatus}`, { company });
});
