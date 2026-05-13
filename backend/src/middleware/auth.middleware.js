import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { config } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const error = new Error('Not authorized, no token provided');
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = await User.findById(decoded.id).populate('companyId').select('-password');
    if (!req.user) {
      const error = new Error('Not authorized, user not found');
      error.statusCode = 401;
      throw error;
    }
    next();
  } catch (err) {
    const error = new Error('Not authorized, token failed');
    error.statusCode = 401;
    throw error;
  }
});
