export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error(`Role: ${req.user ? req.user.role : 'unknown'} is not allowed to access this resource`);
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};
