import * as authService from './auth.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';

export const register = asyncHandler(async (req, res) => {
  const data = await authService.registerUser(req.body);
  return sendSuccess(res, 'User registered successfully', data, 201);
});

export const login = asyncHandler(async (req, res) => {
  const data = await authService.loginUser(req.body.email, req.body.password);
  return sendSuccess(res, 'Login successful', data, 200);
});

export const getMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, 'User fetched successfully', req.user, 200);
});

export default { register, login, getMe };
