export const sendSuccess = (res, message = 'OK', data = null, status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, message = 'Server Error', status = 500, data = null) => {
  return res.status(status).json({
    success: false,
    message,
    data,
  });
};

export default { sendSuccess, sendError };
