import * as uploadService from './upload.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import { AppError } from '../../utils/appError.js';

export const uploadFileHandler = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No file provided', 400);
  }

  const folder = req.body.folder || 'job-portal';
  
  // Pass buffer, folder, name, AND mimetype
  const url = await uploadService.uploadFile(
    req.file.buffer, 
    folder, 
    req.file.originalname,
    req.file.mimetype
  );
  
  return sendSuccess(res, 'File uploaded successfully', { url });
});
