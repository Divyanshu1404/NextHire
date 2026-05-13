import { User } from '../../models/user.model.js';

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password').populate('companyId');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

export const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const directFields = ['name', 'phone', 'gender', 'dateOfBirth', 'location', 'profilePicture'];
  directFields.forEach(field => {
    if (updateData[field] !== undefined) user[field] = updateData[field];
  });

  const profileFields = [
    'skills', 'resumeUrl', 'profileSummary', 'preferredJobType',
    'preferredLocation', 'availability', 'education', 'projects',
    'internships', 'employment', 'languages', 'accomplishments',
    'competitiveExams', 'academicAchievements'
  ];
  profileFields.forEach(field => {
    if (updateData[field] !== undefined) user.profile[field] = updateData[field];
  });

  if (updateData.profile) {
    Object.keys(updateData.profile).forEach(key => {
      if (updateData.profile[key] !== undefined) {
        user.profile[key] = updateData.profile[key];
      }
    });
  }

  await user.save();
  return await User.findById(userId).select('-password');
};
