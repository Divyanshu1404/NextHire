import mongoose from 'mongoose';
import { APPLICATION_STATUS } from '../constants/status.js';

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  status: { 
    type: String, 
    enum: Object.values(APPLICATION_STATUS), 
    default: APPLICATION_STATUS.APPLIED 
  },
  resumeUrl: { type: String },
  coverLetter: { type: String },
  assessmentLink: { type: String },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });


applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ companyId: 1, createdAt: -1 });
applicationSchema.index({ jobId: 1, status: 1 });

export const Application = mongoose.model('Application', applicationSchema);
