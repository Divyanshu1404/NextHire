import { Company } from '../../models/company.model.js';
import { User } from '../../models/user.model.js';
import { ROLES } from '../../constants/roles.js';

const getUserCompanyId = (user) => user?.companyId?._id || user?.companyId;

export const registerCompany = async (companyData, userId) => {
  const { companyName, email, website, registrationNumber, kycDocumentUrl } = companyData;

  const existingCompany = await Company.findOne({ registrationNumber });
  if (existingCompany) {
    const error = new Error('Company with this registration number already exists');
    error.statusCode = 400;
    throw error;
  }

  const company = await Company.create({
    companyName,
    email,
    website,
    registrationNumber,
    kycDocumentUrl,
    createdBy: userId
  });


  await User.findByIdAndUpdate(userId, { 
    companyId: company._id,
    role: ROLES.COMPANY_ADMIN 
  });

  return company;
};

export const getCompanyById = async (companyId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    const error = new Error('Company not found');
    error.statusCode = 404;
    throw error;
  }
  return company;
};

export const getApprovedCompanies = async () => {
  const companies = await Company.find({ verificationStatus: 'approved' }).sort({ createdAt: -1 });
  return companies;
};


export const addTeamMember = async (email, role, companyId) => {
  const user = await User.findOne({ email });
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
  const { Job } = await import('../../models/job.model.js');
  const { Application } = await import('../../models/application.model.js');
  const { APPLICATION_STATUS } = await import('../../constants/status.js');

  const totalJobs = await Job.countDocuments({ companyId });
  
  const companyJobs = await Job.find({ companyId }).select('_id');
  const jobIds = companyJobs.map(job => job._id);

  const totalApplications = await Application.countDocuments({ jobId: { $in: jobIds } });
  
  // New applications (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const newApplications = await Application.countDocuments({ 
    jobId: { $in: jobIds },
    createdAt: { $gte: sevenDaysAgo }
  });

  const shortlistedCount = await Application.countDocuments({ 
    jobId: { $in: jobIds }, 
    status: APPLICATION_STATUS.SHORTLISTED 
  });

  // Fetch recent activity (last 5 applications)
  const recentActivity = await Application.find({ jobId: { $in: jobIds } })
    .populate('userId', 'name')
    .populate('jobId', 'title')
    .sort({ createdAt: -1 })
    .limit(5);

  const formattedActivity = recentActivity.map(app => ({
    id: app._id,
    user: app.userId?.name || 'Unknown User',
    job: app.jobId?.title || 'Unknown Job',
    status: app.status,
    time: app.createdAt
  }));

  return {
    activeJobs: totalJobs,
    totalCandidates: totalApplications,
    newApplications,
    shortlisted: shortlistedCount,
    recentActivity: formattedActivity
  };
};

export const getCompanyTeam = async (companyId) => {
  const users = await User.find({ companyId })
    .select('name email role profilePicture createdAt')
    .sort({ createdAt: -1 });
  return users;
};

export const updateCompanyById = async (companyId, updateData, user) => {
  const company = await Company.findById(companyId);
  if (!company) {
    const error = new Error('Company not found');
    error.statusCode = 404;
    throw error;
  }

  // Only allow company admins of this company or super admin to update
  const isSameCompany = getUserCompanyId(user)?.toString() === companyId.toString();
  const isSuperAdmin = user.role === ROLES.SUPER_ADMIN;
  if (!isSameCompany && !isSuperAdmin) {
    const error = new Error('Not authorized to update this company');
    error.statusCode = 403;
    throw error;
  }

  const { companyName, email, website, registrationNumber, kycDocumentUrl, logoUrl } = updateData;

  if (registrationNumber && registrationNumber !== company.registrationNumber) {
    const existing = await Company.findOne({ registrationNumber });
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
  const company = await Company.findById(companyId);
  if (!company) {
    const error = new Error('Company not found');
    error.statusCode = 404;
    throw error;
  }

  // Only super admin can delete companies
  if (user.role !== ROLES.SUPER_ADMIN) {
    const error = new Error('Only Super Admin can delete companies');
    error.statusCode = 403;
    throw error;
  }

  // Delete all jobs associated with this company
  const { Job } = await import('../../models/job.model.js');
  await Job.deleteMany({ companyId });

  // Delete all applications associated with this company's jobs
  const { Application } = await import('../../models/application.model.js');
  const companyJobs = await Job.find({ companyId }).select('_id');
  const jobIds = companyJobs.map(job => job._id);
  await Application.deleteMany({ jobId: { $in: jobIds } });

  // Remove company reference from all users
  await User.updateMany({ companyId }, { companyId: null, role: ROLES.USER });

  // Delete the company
  await Company.findByIdAndDelete(companyId);

  return { message: 'Company deleted successfully' };
};
