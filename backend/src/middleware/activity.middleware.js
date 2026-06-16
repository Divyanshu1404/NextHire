import ActivityLog from '../models/activityLog.model.js';

export const logActivity = (action, detailsExtractor) => {
  return async (req, res, next) => {
    // We need to capture the response finish to ensure the action was successful
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const details = typeof detailsExtractor === 'function' 
            ? detailsExtractor(req) 
            : detailsExtractor;

          await ActivityLog.create({
            user: req.user?._id || req.user?.id,
            company: req.user?.companyId,
            action,
            details,
            metadata: {
              method: req.method,
              url: req.originalUrl,
              statusCode: res.statusCode
            },
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
          });
        } catch (error) {
          console.error('Failed to log activity:', error);
        }
      }
    });
    next();
  };
};
