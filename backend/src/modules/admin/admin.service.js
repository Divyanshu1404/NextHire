import { Company } from '../../models/company.model.js';
import { COMPANY_VERIFICATION_STATUS } from '../../constants/status.js';

export const getAllCompanies = async () => {
  return await Company.find().populate('createdBy', 'name email');
};

export const updateCompanyKYCStatus = async (companyId, status) => {
  if (!Object.values(COMPANY_VERIFICATION_STATUS).includes(status)) {
    const error = new Error('Invalid verification status');
    error.statusCode = 400;
    throw error;
  }

  const company = await Company.findById(companyId);
  if (!company) {
    const error = new Error('Company not found');
    error.statusCode = 404;
    throw error;
  }

  company.verificationStatus = status;
  await company.save();
  return company;
};
