import * as jobRepository from '../../repositories/job.repository.js';
import * as companyRepository from '../../repositories/company.repository.js';
import { COMPANY_VERIFICATION_STATUS } from '../../constants/status.js';

export const createJob = async (jobData, userId, companyId) => {
  if (!companyId) {
    const error = new Error('User is not associated with any company');
    error.statusCode = 400;
    throw error;
  }

  const company = await companyRepository.findById(companyId);
  if (!company || company.verificationStatus !== COMPANY_VERIFICATION_STATUS.APPROVED) {
    const error = new Error('Company must be approved to post jobs');
    error.statusCode = 403;
    throw error;
  }

  return jobRepository.createJob({
    ...jobData,
    companyId,
    createdBy: userId,
  });
};

export const getJobs = async (query = {}) => {
  const { items, page, limit, total } = await jobRepository.findByFilters(query);
  return { items, page, limit, total };
};

export const getJobById = async (id) => {
  const job = await jobRepository.findById(id);
  if (!job) {
    const error = new Error('Job not found');
    error.statusCode = 404;
    throw error;
  }
  return job;
};

export const updateJob = async (jobId, updateData, companyId, userId, isSuperAdmin = false, isCompanyAdmin = false) => {
  const query = { _id: jobId };

  if (!isSuperAdmin) {
    query.companyId = companyId;
    if (!isCompanyAdmin) {
      query.createdBy = userId;
    }
  }

  const job = await jobRepository.findOneAndUpdate(query, updateData);
  if (!job) {
    const error = new Error('Job not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }
  return job;
};

export const deleteJob = async (jobId, companyId, userId, isSuperAdmin = false, isCompanyAdmin = false) => {
  const query = { _id: jobId };

  if (!isSuperAdmin) {
    query.companyId = companyId;
    if (!isCompanyAdmin) {
      query.createdBy = userId;
    }
  }

  const job = await jobRepository.findOneAndDelete(query);
  if (!job) {
    const error = new Error('Job not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }
  return job;
};

export const getJobsByCompany = async (companyId) => {
  return jobRepository.findByCompanyId(companyId);
};
