import { User } from '../models/user.model.js';

export const findByEmail = async (email) => {
  return User.findOne({ email }).populate('companyId');
};

export const findById = async (id) => {
  return User.findById(id).populate('companyId').select('-password');
};

export const findByIdWithPassword = async (id) => {
  return User.findById(id).populate('companyId');
};

export const findByCompanyId = async (companyId) => {
  return User.find({ companyId }).select('name email role profilePicture createdAt').sort({ createdAt: -1 });
};

export const create = async (payload) => {
  return User.create(payload);
};

export const findOneAndUpdate = async (filter, update) => {
  return User.findOneAndUpdate(filter, update, { new: true });
};

export const updateMany = async (filter, update) => {
  return User.updateMany(filter, update);
};

export const countDocuments = async (filter = {}) => {
  return User.countDocuments(filter);
};

export default {
  findByEmail,
  findById,
  findByIdWithPassword,
  findByCompanyId,
  create,
  findOneAndUpdate,
  updateMany,
  countDocuments,
};
