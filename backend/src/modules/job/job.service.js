import { Job } from '../../models/job.model.js';
import { Company } from '../../models/company.model.js';
import { COMPANY_VERIFICATION_STATUS } from '../../constants/status.js';

export const createJob = async (jobData, userId, companyId) => {
  if (!companyId) {
    const error = new Error('User is not associated with any company');
    error.statusCode = 400;
    throw error;
  }

  const company = await Company.findById(companyId);
  if (!company || company.verificationStatus !== COMPANY_VERIFICATION_STATUS.APPROVED) {
    const error = new Error('Company must be approved to post jobs');
    error.statusCode = 403;
    throw error;
  }

  const job = await Job.create({
    ...jobData,
    companyId,
    createdBy: userId
  });

  return job;
};

export const getJobs = async (query = {}) => {
  const filter = {};

  if (query.companyId) {
    filter.companyId = query.companyId;
  }

  if (query.keyword) {
    filter.$or = [
      { title: { $regex: query.keyword, $options: 'i' } },
      { description: { $regex: query.keyword, $options: 'i' } }
    ];
  }

  if (query.location) {
    filter.location = { $regex: query.location, $options: 'i' };
  }

  if (query.jobType) {
    filter.jobType = query.jobType;
  }

  const jobs = await Job.find(filter)
    .populate('companyId', 'companyName website logoUrl')
    .sort({ createdAt: -1 });
  return jobs;
};

export const getJobById = async (id) => {
  const job = await Job.findById(id).populate('companyId', 'companyName website logoUrl');
  if (!job) {
    const error = new Error('Job not found');
    error.statusCode = 404;
    throw error;
  }
  return job;
};

export const updateJob = async (jobId, updateData, companyId, userId, isSuperAdmin = false, isCompanyAdmin = false) => {
  let query = { _id: jobId };
  
  if (!isSuperAdmin) {
    if (isCompanyAdmin) {
      query.companyId = companyId;
    } else {
      query.companyId = companyId;
      query.createdBy = userId;
    }
  }

  const job = await Job.findOne(query);
  if (!job) {
    const error = new Error('Job not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }

  Object.assign(job, updateData);
  await job.save();
  return job;
};

export const deleteJob = async (jobId, companyId, userId, isSuperAdmin = false, isCompanyAdmin = false) => {
  let query = { _id: jobId };
  
  if (!isSuperAdmin) {
    if (isCompanyAdmin) {
      query.companyId = companyId;
    } else {
      query.companyId = companyId;
      query.createdBy = userId;
    }
  }

  const job = await Job.findOneAndDelete(query);
  if (!job) {
    const error = new Error('Job not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }
  return job;
};

export const getJobsByCompany = async (companyId) => {
  const jobs = await Job.find({ companyId }).populate('companyId', 'companyName website logoUrl').sort({ createdAt: -1 });
  return jobs;
};
