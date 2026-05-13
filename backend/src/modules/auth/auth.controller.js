import * as authService from './auth.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { apiResponse } from '../../utils/apiResponse.js';

export const register = asyncHandler(async (req, res) => {
  const data = await authService.registerUser(req.body);
  apiResponse(res, 201, 'User registered successfully', data);
});

export const login = asyncHandler(async (req, res) => {
  const data = await authService.loginUser(req.body.email, req.body.password);
  apiResponse(res, 200, 'Login successful', data);
});

export const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware
  apiResponse(res, 200, 'User fetched successfully', req.user);
});
