import mongoose from 'mongoose';
import { COMPANY_VERIFICATION_STATUS } from '../constants/status.js';

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String },
  logoUrl: { type: String, default: '' },
  registrationNumber: { type: String, required: true, unique: true },
  kycDocumentUrl: { type: String, required: true },
  verificationStatus: { 
    type: String, 
    enum: Object.values(COMPANY_VERIFICATION_STATUS), 
    default: COMPANY_VERIFICATION_STATUS.PENDING 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

companySchema.index({ verificationStatus: 1, createdAt: -1 });

export const Company = mongoose.model('Company', companySchema);
