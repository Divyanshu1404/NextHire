import * as userService from './user.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserProfile(req.user.id);
  return sendSuccess(res, 'Profile retrieved successfully', { user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateUserProfile(req.user.id, req.body);
  return sendSuccess(res, 'Profile updated successfully', { user });
});
 