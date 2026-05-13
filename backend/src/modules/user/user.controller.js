import * as userService from './user.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { apiResponse } from '../../utils/apiResponse.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserProfile(req.user.id);
  apiResponse(res, 200, 'Profile retrieved successfully', { user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateUserProfile(req.user.id, req.body);
  apiResponse(res, 200, 'Profile updated successfully', { user });
});
 