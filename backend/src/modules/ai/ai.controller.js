import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import * as aiService from './ai.service.js';

export const scoreResume = asyncHandler(async (req, res) => {
  const result = await aiService.scoreResumeMatch(req.body);
  return sendSuccess(res, 'Resume scored successfully', result);
});
