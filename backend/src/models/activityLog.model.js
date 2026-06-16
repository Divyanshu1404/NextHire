import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  action: {
    type: String,
    required: true,
    enum: [
      'JOB_CREATED', 'JOB_UPDATED', 'JOB_DELETED',
      'APPLICATION_STATUS_UPDATED', 'ASSESSMENT_SENT',
      'TEAM_MEMBER_ADDED', 'KYC_SUBMITTED', 'KYC_STATUS_UPDATED',
      'PROFILE_UPDATED'
    ]
  },
  details: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

activityLogSchema.index({ company: 1, createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
