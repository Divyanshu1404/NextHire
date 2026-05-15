import { Application } from '../models/application.model.js';

export const createApplication = async (data) => Application.create(data);
export const findById = async (applicationId) => Application.findById(applicationId);
export const findOne = async (filter) => Application.findOne(filter);
export const findByJobId = async (jobId, companyId) => Application.find({ jobId, companyId }).populate('userId', 'name email profilePicture profile');
export const findByCompanyId = async (companyId) => Application.find({ companyId }).populate('userId', 'name email profilePicture profile').populate('jobId', 'title').sort({ createdAt: -1 });
export const findByUserId = async (userId) => Application.find({ userId }).populate({ path: 'jobId', select: 'title location companyId', populate: { path: 'companyId', select: 'companyName' } });
export const save = async (application) => application.save();
export const deleteMany = async (filter) => Application.deleteMany(filter);
export const countDocuments = async (filter = {}) => Application.countDocuments(filter);

export default {
  createApplication,
  findById,
  findOne,
  findByJobId,
  findByCompanyId,
  findByUserId,
  save,
  deleteMany,
  countDocuments,
};
