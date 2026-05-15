import api from '../api/httpClient.js';

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  getProfile: () => api.get('/users/profile'),
};

export const jobsAPI = {
  getAllJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  postJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getCompanyJobs: () => api.get('/jobs/get/company-jobs'),
  getPublicStats: () => api.get('/jobs/stats'),
};

export const applicationAPI = {
  applyToJob: (data) => api.post('/application', data),
  getMyApplications: () => api.get('/application/my-applications'),
  getJobApplications: (jobId) => api.get(`/application/job/${jobId}`),
  getCompanyApplications: () => api.get('/application/get/company-applications'),
  updateApplicationStatus: (id, status) => api.put(`/application/${id}/status`, { status }),
  sendAssessmentLink: (id, assessmentLink) => api.post(`/application/${id}/assessment`, { assessmentLink }),
};

export const companyAPI = {
  getAllApprovedCompanies: () => api.get('/company'),
  registerCompany: (data) => api.post('/company/register', data),
  getCompanyDetails: (id) => api.get(`/company/${id}`),
  getCompanyStats: () => api.get('/company/dashboard/stats'),
  addTeamMember: (data) => api.post('/company/team/add', data),
  getCompanyTeam: () => api.get('/company/team/all'),
  updateCompany: (id, data) => api.put(`/company/${id}`, data),
};

export const adminAPI = {
  getAllCompanies: () => api.get('/admin/companies'),
  updateKYCStatus: (companyId, status) => api.put(`/admin/companies/${companyId}/kyc`, { status }),
  deleteCompany: (companyId) => api.delete(`/company/${companyId}`),
};

export const uploadAPI = {
  uploadFile: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};
