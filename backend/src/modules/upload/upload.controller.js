import * as uploadService from './upload.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { apiResponse } from '../../utils/apiResponse.js';

export const uploadFileHandler = asyncHandler(async (req, res) => {
  if (!req.file) {
    const error = new Error('No file provided');
    error.statusCode = 400;
    throw error;
  }

  const folder = req.body.folder || 'job-portal';
  
  // Pass buffer, folder, name, AND mimetype
  const url = await uploadService.uploadFile(
    req.file.buffer, 
    folder, 
    req.file.originalname,
    req.file.mimetype
  );
  
  apiResponse(res, 200, 'File uploaded successfully', { url });
});
