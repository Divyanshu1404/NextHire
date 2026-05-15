import { Job } from '../models/job.model.js';
import { getPagination } from '../helpers/pagination.helper.js';
import { buildRegexFilter, sanitizeMongoQuery } from '../helpers/query.helper.js';

export const createJob = async (data) => Job.create(data);
export const findById = async (jobId) => Job.findById(jobId).populate('companyId', 'companyName website logoUrl');

export const findByCompanyId = async (companyId) => {
  return Job.find({ companyId }).populate('companyId', 'companyName website logoUrl').sort({ createdAt: -1 });
};

export const findByFilters = async (query = {}) => {
  const safeQuery = sanitizeMongoQuery(query);
  const { page, limit, skip } = getPagination(safeQuery);
  const filter = {};

  if (safeQuery.companyId) filter.companyId = safeQuery.companyId;
  if (safeQuery.keyword) {
    filter.$or = [
      { title: buildRegexFilter(safeQuery.keyword) },
      { description: buildRegexFilter(safeQuery.keyword) },
    ];
  }
  if (safeQuery.location) filter.location = buildRegexFilter(safeQuery.location);
  if (safeQuery.jobType) filter.jobType = safeQuery.jobType;

  const [items, total] = await Promise.all([
    Job.find(filter)
      .populate('companyId', 'companyName website logoUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Job.countDocuments(filter),
  ]);

  return { items, page, limit, total };
};

export const findOneAndUpdate = async (filter, updateData) => Job.findOneAndUpdate(filter, updateData, { new: true });
export const findOneAndDelete = async (filter) => Job.findOneAndDelete(filter);
export const deleteMany = async (filter) => Job.deleteMany(filter);
export const countDocuments = async (filter = {}) => Job.countDocuments(filter);

export default {
  createJob,
  findById,
  findByCompanyId,
  findByFilters,
  findOneAndUpdate,
  findOneAndDelete,
  deleteMany,
  countDocuments,
};
