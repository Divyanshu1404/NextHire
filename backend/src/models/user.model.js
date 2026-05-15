import mongoose from 'mongoose';
import { ROLE_HIERARCHY, ROLES } from '../constants/roles.js';

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  graduationYear: { type: Number },
  score: { type: String, default: '' },
  courseType: { type: String, enum: ['Full Time', 'Part Time', 'Distance'], default: 'Full Time' },
  isCurrentlyStudying: { type: Boolean, default: false }
}, { _id: true });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  link: { type: String, default: '' },
  startDate: { type: String },
  endDate: { type: String }
}, { _id: true });

const internshipSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String },
  description: { type: String },
  startDate: { type: String },
  endDate: { type: String }
}, { _id: true });

const employmentSchema = new mongoose.Schema({
  company: { type: String, required: true },
  designation: { type: String },
  description: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  isCurrent: { type: Boolean, default: false }
}, { _id: true });

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' }
}, { _id: true });

const accomplishmentSchema = new mongoose.Schema({
  type: { type: String, enum: ['certification', 'award', 'club'], required: true },
  title: { type: String, required: true },
  description: { type: String }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ROLE_HIERARCHY, default: ROLES.USER },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
  profilePicture: { type: String, default: '' },
  phone: { type: String, default: '' },
  gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
  dateOfBirth: { type: String, default: '' },
  location: { type: String, default: '' },
  profile: {
    skills: [{ type: String }],
    resumeUrl: { type: String, default: '' },
    profileSummary: { type: String, default: '' },
    preferredJobType: { type: String, default: '' },
    preferredLocation: { type: String, default: '' },
    availability: { type: String, default: '' },
    education: [educationSchema],
    projects: [projectSchema],
    internships: [internshipSchema],
    employment: [employmentSchema],
    languages: [languageSchema],
    accomplishments: [accomplishmentSchema],
    competitiveExams: [{ type: String }],
    academicAchievements: [{ type: String }]
  }
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ companyId: 1, role: 1 });

export const User = mongoose.model('User', userSchema);
