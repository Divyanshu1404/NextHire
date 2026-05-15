import * as companyService from './company.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';

const getCompId = (user) => user.companyId?._id || user.companyId;

export const registerCompany = asyncHandler(async (req, res) => {
  const company = await companyService.registerCompany(req.body, req.user.id);
  return sendSuccess(res, 'Company registered successfully. KYC pending approval.', { company }, 201);
});

export const getCompany = asyncHandler(async (req, res) => {
  const company = await companyService.getCompanyById(req.params.id);
  return sendSuccess(res, 'Company retrieved successfully', { company });
});

export const getApprovedCompanies = asyncHandler(async (req, res) => {
  const companies = await companyService.getApprovedCompanies();
  return sendSuccess(res, 'Companies retrieved successfully', { companies });
});

export const getCompanyStats = asyncHandler(async (req, res) => {
  const stats = await companyService.getCompanyStats(getCompId(req.user));
  return sendSuccess(res, 'Company stats retrieved successfully', { stats });
});

export const getTeam = asyncHandler(async (req, res) => {
  const team = await companyService.getCompanyTeam(getCompId(req.user));
  return sendSuccess(res, 'Team members retrieved', { team });
});

export const addTeamMember = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const user = await companyService.addTeamMember(email, role, getCompId(req.user));
  return sendSuccess(res, 'Team member added successfully', { user });
});

export const updateCompany = asyncHandler(async (req, res) => {
  const company = await companyService.updateCompanyById(req.params.id, req.body, req.user);
  return sendSuccess(res, 'Company updated successfully', { company });
});

export const deleteCompany = asyncHandler(async (req, res) => {
  await companyService.deleteCompanyById(req.params.id, req.user);
  return sendSuccess(res, 'Company deleted successfully');
});
