import * as applicationRepository from '../../repositories/application.repository.js';
import * as jobRepository from '../../repositories/job.repository.js';
import * as companyRepository from '../../repositories/company.repository.js';
import { sendAssessmentEmail } from '../../utils/email.service.js';
import { APPLICATION_STATUS } from '../../constants/status.js';

export const applyForJob = async (jobId, userId, applicationData) => {
  const { resumeUrl, coverLetter } = applicationData;
  const job = await jobRepository.findById(jobId);
  if (!job) {
    const error = new Error('Job not found');
    error.statusCode = 404;
    throw error;
  }

  const existingApplication = await applicationRepository.findOne({ jobId, userId });
  if (existingApplication) {
    const error = new Error('You have already applied for this job');
    error.statusCode = 400;
    throw error;
  }

  return applicationRepository.createApplication({
    userId,
    jobId,
    companyId: job.companyId,
    resumeUrl,
    coverLetter,
  });
};

export const updateApplicationStatus = async (applicationId, updateData, userId, role) => {
  const { status, assessmentLink } = updateData;

  const application = await applicationRepository.findById(applicationId);
  if (!application) {
    const error = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }

  if (role === 'hr' && !['shortlisted', 'rejected'].includes(status)) {
    const error = new Error('HR can only shortlist or reject');
    error.statusCode = 403;
    throw error;
  }

  application.status = status;
  if (assessmentLink) {
    application.assessmentLink = assessmentLink;
  }
  application.updatedBy = userId;

  await applicationRepository.save(application);
  return application;
};

export const sendAssessment = async (applicationId, assessmentLink, userId) => {
  const application = await applicationRepository.findById(applicationId)
    .populate('userId', 'name email')
    .populate('jobId', 'title companyId');

  if (!application) {
    const error = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }

  const company = await companyRepository.findById(application.jobId.companyId);

  application.status = APPLICATION_STATUS.ASSESSMENT_SENT;
  application.assessmentLink = assessmentLink;
  application.updatedBy = userId;
  await applicationRepository.save(application);

  await sendAssessmentEmail(
    application.userId.email,
    application.userId.name,
    application.jobId.title,
    company?.companyName || 'Our Company',
    assessmentLink
  );

  return application;
};

export const getApplicationsForJob = async (jobId, companyId) => {
  return applicationRepository.findByJobId(jobId, companyId);
};

export const getCompanyApplications = async (companyId) => {
  return applicationRepository.findByCompanyId(companyId);
};

export const getUserApplications = async (userId) => {
  return applicationRepository.findByUserId(userId);
};
