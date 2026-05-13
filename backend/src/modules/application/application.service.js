import { Application } from '../../models/application.model.js';
import { Job } from '../../models/job.model.js';
import { sendAssessmentEmail } from '../../utils/email.service.js';
import { APPLICATION_STATUS } from '../../constants/status.js';


export const applyForJob = async (jobId, userId, applicationData) => {
  const { resumeUrl, coverLetter } = applicationData;
  const job = await Job.findById(jobId);
  if (!job) {
    const error = new Error('Job not found');
    error.statusCode = 404;
    throw error;
  }

  const existingApplication = await Application.findOne({ jobId, userId });
  if (existingApplication) {
    const error = new Error('You have already applied for this job');
    error.statusCode = 400;
    throw error;
  }

  const application = await Application.create({
    userId,
    jobId,
    companyId: job.companyId,
    resumeUrl,
    coverLetter
  });

  return application;
};


export const updateApplicationStatus = async (applicationId, updateData, userId, role) => {
  const { status, assessmentLink } = updateData;

  const application = await Application.findById(applicationId);
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

  await application.save();
  return application;
};

export const sendAssessment = async (applicationId, assessmentLink, userId) => {
  const application = await Application.findById(applicationId)
    .populate('userId', 'name email')
    .populate('jobId', 'title companyId');
    
  if (!application) {
    const error = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }

  // Populate companyName manually or from Job
  const { Company } = await import('../../models/company.model.js');
  const company = await Company.findById(application.jobId.companyId);

  application.status = APPLICATION_STATUS.ASSESSMENT_SENT;
  application.assessmentLink = assessmentLink;
  application.updatedBy = userId;
  await application.save();

  // Send email
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
  const applications = await Application.find({ jobId, companyId })
    .populate('userId', 'name email profilePicture profile');
  return applications;
};

export const getCompanyApplications = async (companyId) => {
  const applications = await Application.find({ companyId })
    .populate('userId', 'name email profilePicture profile')
    .populate('jobId', 'title')
    .sort({ createdAt: -1 });
  return applications;
};


export const getUserApplications = async (userId) => {
  const applications = await Application.find({ userId }).populate({
    path: 'jobId',
    select: 'title location companyId',
    populate: { path: 'companyId', select: 'companyName' }
  });
  return applications;
};
