import { AppError } from '../utils/appError.js';

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(`Role: ${req.user ? req.user.role : 'unknown'} is not allowed to access this resource`, 403));
    }
    next();
  };
};
