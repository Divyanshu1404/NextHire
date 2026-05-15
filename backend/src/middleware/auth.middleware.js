import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import * as userRepository from '../repositories/user.repository.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized, no token provided', 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = await userRepository.findById(decoded.id);
    if (!req.user) {
      throw new AppError('Not authorized, user not found', 401);
    }
    next();
  } catch (err) {
    throw new AppError('Not authorized, token failed', 401);
  }
});
