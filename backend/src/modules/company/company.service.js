import * as companyRepository from '../../repositories/company.repository.js';
import * as userRepository from '../../repositories/user.repository.js';
import * as jobRepository from '../../repositories/job.repository.js';
import * as applicationRepository from '../../repositories/application.repository.js';
import { ROLES } from '../../constants/roles.js';
import { APPLICATION_STATUS } from '../../constants/status.js';

const getUserCompanyId = (user) => user?.companyId?._id || user?.companyId;

export const registerCompany = async (companyData, userId) => {
  const { companyName, email, website, registrationNumber, kycDocumentUrl } = companyData;

  const existingCompany = await companyRepository.findByRegistrationNumber(registrationNumber);
  if (existingCompany) {
    const error = new Error('Company with this registration number already exists');
    error.statusCode = 400;
    throw error;
  }

  const company = await companyRepository.createCompany({
    companyName,
    email,
    website,
    registrationNumber,
    kycDocumentUrl,
    createdBy: userId,
  });

  await userRepository.findOneAndUpdate({ _id: userId }, {
    companyId: company._id,
    role: ROLES.COMPANY_ADMIN,
  });

  return company;
};

export const getCompanyById = async (companyId) => {
  const company = await companyRepository.findById(companyId);
  if (!company) {
    const error = new Error('Company not found');
    error.statusCode = 404;
    throw error;
  }
  return company;
};

export const getApprovedCompanies = async () => {
  return companyRepository.findApproved();
};

export const addTeamMember = async (email, role, companyId) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error('User not found. They must register first.');
    error.statusCode = 404;
    throw error;
  }

  if (user.companyId && user.companyId.toString() !== companyId.toString()) {
    const error = new Error('User is already associated with another company.');
    error.statusCode = 400;
    throw error;
  }

  user.companyId = companyId;
  user.role = role;
  await user.save();

  return user;
};

export const getCompanyStats = async (companyId) => {
  const totalJobs = await jobRepository.countDocuments({ companyId });
  const companyJobs = await jobRepository.findByCompanyId(companyId);
  const jobIds = companyJobs.map((job) => job._id);

  const totalApplications = await applicationRepository.countDocuments({ jobId: { $in: jobIds } });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const newApplications = await applicationRepository.countDocuments({
    jobId: { $in: jobIds },
    createdAt: { $gte: sevenDaysAgo },
  });

  const shortlistedCount = await applicationRepository.countDocuments({
    jobId: { $in: jobIds },
    status: APPLICATION_STATUS.SHORTLISTED,
  });

  const recentActivity = await applicationRepository.findByCompanyId(companyId);
  const formattedActivity = recentActivity.slice(0, 5).map((app) => ({
    id: app._id,
    user: app.userId?.name || 'Unknown User',
    job: app.jobId?.title || 'Unknown Job',
    status: app.status,
    time: app.createdAt,
  }));

  return {
    activeJobs: totalJobs,
    totalCandidates: totalApplications,
    newApplications,
    shortlisted: shortlistedCount,
    recentActivity: formattedActivity,
  };
};

export const getCompanyTeam = async (companyId) => {
  return userRepository.findByCompanyId(companyId);
};

export const updateCompanyById = async (companyId, updateData, user) => {
  const company = await companyRepository.findById(companyId);
  if (!company) {
    const error = new Error('Company not found');
    error.statusCode = 404;
    throw error;
  }

  const isSameCompany = getUserCompanyId(user)?.toString() === companyId.toString();
  const isSuperAdmin = user.role === ROLES.SUPER_ADMIN;
  if (!isSameCompany && !isSuperAdmin) {
    const error = new Error('Not authorized to update this company');
    error.statusCode = 403;
    throw error;
  }

  const { companyName, email, website, registrationNumber, kycDocumentUrl, logoUrl } = updateData;

  if (registrationNumber && registrationNumber !== company.registrationNumber) {
    const existing = await companyRepository.findByRegistrationNumber(registrationNumber);
    if (existing) {
      const error = new Error('Another company with this registration number already exists');
      error.statusCode = 400;
      throw error;
    }
    company.registrationNumber = registrationNumber;
  }

  if (companyName) company.companyName = companyName;
  if (email) company.email = email;
  if (website) company.website = website;
  if (kycDocumentUrl) company.kycDocumentUrl = kycDocumentUrl;
  if (logoUrl) company.logoUrl = logoUrl;

  await company.save();
  return company;
};

export const deleteCompanyById = async (companyId, user) => {
  const company = await companyRepository.findById(companyId);
  if (!company) {
    const error = new Error('Company not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== ROLES.SUPER_ADMIN) {
    const error = new Error('Only Super Admin can delete companies');
    error.statusCode = 403;
    throw error;
  }

  const companyJobs = await jobRepository.findByCompanyId(companyId);
  const jobIds = companyJobs.map((job) => job._id);
  await applicationRepository.deleteMany({ jobId: { $in: jobIds } });
  await jobRepository.deleteMany({ companyId });
  await userRepository.updateMany({ companyId }, { companyId: null, role: ROLES.USER });
  await companyRepository.deleteById(companyId);

  return { message: 'Company deleted successfully' };
};
