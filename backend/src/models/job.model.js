import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillsRequired: [{ type: String }],
  location: { type: String, required: true },
  salaryRange: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'INR' }
  },
  jobType: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
    default: 'Full-time' 
  },
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior', 'Executive'],
    default: 'Entry'
  }
}, { timestamps: true });

jobSchema.index({ companyId: 1, createdAt: -1 });
jobSchema.index({ title: 'text', description: 'text', location: 'text' });

export const Job = mongoose.model('Job', jobSchema);
