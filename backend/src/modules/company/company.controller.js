import * as companyService from './company.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { apiResponse } from '../../utils/apiResponse.js';

const getCompId = (user) => user.companyId?._id || user.companyId;

export const registerCompany = asyncHandler(async (req, res) => {
  const company = await companyService.registerCompany(req.body, req.user.id);
  apiResponse(res, 201, 'Company registered successfully. KYC pending approval.', { company });
});

export const getCompany = asyncHandler(async (req, res) => {
  const company = await companyService.getCompanyById(req.params.id);
  apiResponse(res, 200, 'Company retrieved successfully', { company });
});

export const getApprovedCompanies = asyncHandler(async (req, res) => {
  const companies = await companyService.getApprovedCompanies();
  apiResponse(res, 200, 'Companies retrieved successfully', { companies });
});

export const getCompanyStats = asyncHandler(async (req, res) => {
  const stats = await companyService.getCompanyStats(getCompId(req.user));
  apiResponse(res, 200, 'Company stats retrieved successfully', { stats });
});

export const getTeam = asyncHandler(async (req, res) => {
  const team = await companyService.getCompanyTeam(getCompId(req.user));
  apiResponse(res, 200, 'Team members retrieved', { team });
});

export const addTeamMember = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const user = await companyService.addTeamMember(email, role, getCompId(req.user));
  apiResponse(res, 200, 'Team member added successfully', { user });
});

export const updateCompany = asyncHandler(async (req, res) => {
  const company = await companyService.updateCompanyById(req.params.id, req.body, req.user);
  apiResponse(res, 200, 'Company updated successfully', { company });
});

export const deleteCompany = asyncHandler(async (req, res) => {
  await companyService.deleteCompanyById(req.params.id, req.user);
  apiResponse(res, 200, 'Company deleted successfully');
});
