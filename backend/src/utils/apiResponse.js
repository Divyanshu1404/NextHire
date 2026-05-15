import { sendSuccess } from './response.js';

export const apiResponse = (res, statusCode, message, data = null) => {
  return sendSuccess(res, message, data, statusCode);
};

export default apiResponse;
