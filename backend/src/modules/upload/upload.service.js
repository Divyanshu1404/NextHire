import cloudinary from '../../config/cloudinary.js';
import streamifier from 'streamifier';
import { AppError } from '../../utils/appError.js';
import { log } from '../../utils/logger.js';

export const uploadFile = async (fileBuffer, folder = 'job-portal', originalName = '', mimetype = '') => {
  if (!fileBuffer) {
    throw new AppError('File buffer is required', 400);
  }

  const isPdf = mimetype === 'application/pdf' || originalName.toLowerCase().endsWith('.pdf');
  const isImage = mimetype?.startsWith('image/');
  const resourceType = isPdf ? 'raw' : (isImage ? 'image' : 'auto');

  const uniqueId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const ext = originalName.includes('.') ? originalName.split('.').pop() : '';
  const publicId = ext ? `${uniqueId}.${ext}` : uniqueId;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        access_mode: 'public',
        public_id: publicId,
      },
      (error, result) => {
        if (error) {
          log('[UploadService] Cloudinary Error:', error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};
