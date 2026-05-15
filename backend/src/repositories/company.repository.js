import { Company } from '../models/company.model.js';

export const createCompany = async (data) => Company.create(data);
export const findById = async (companyId) => Company.findById(companyId);
export const findByRegistrationNumber = async (registrationNumber) => Company.findOne({ registrationNumber });
export const findApproved = async () => Company.find({ verificationStatus: 'approved' }).sort({ createdAt: -1 });
export const findAllWithCreator = async () => Company.find().populate('createdBy', 'name email');
export const deleteById = async (companyId) => Company.findByIdAndDelete(companyId);
export const countDocuments = async (filter = {}) => Company.countDocuments(filter);

export default {
  createCompany,
  findById,
  findByRegistrationNumber,
  findApproved,
  findAllWithCreator,
  deleteById,
  countDocuments,
};
