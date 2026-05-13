import cloudinary from '../../config/cloudinary.js';
import streamifier from 'streamifier';

export const uploadFile = async (fileBuffer, folder = 'job-portal', originalName = '', mimetype = '') => {
  // Determine resource type
  // Use mimetype first, then fallback to extension
  const isPdf = mimetype === 'application/pdf' || originalName.toLowerCase().endsWith('.pdf');
  const isImage = mimetype.startsWith('image/');
  
  // For PDFs and other documents, we MUST use 'raw'
  // For images, we use 'image' or 'auto'
  const resourceType = isPdf ? 'raw' : (isImage ? 'image' : 'auto');

  console.log(`[UploadService] Uploading file: ${originalName}`);
  console.log(`[UploadService] Detected Mimetype: ${mimetype}`);
  console.log(`[UploadService] Selected ResourceType: ${resourceType}`);

  // Generate a unique public_id with the original extension
  const uniqueId = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
  const ext = originalName.includes('.') ? originalName.split('.').pop() : '';
  const publicId = ext ? `${uniqueId}.${ext}` : uniqueId;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder, 
        resource_type: resourceType,
        access_mode: 'public',
        public_id: publicId // Force the extension in the URL
      },
      (error, result) => {
        if (error) {
          console.error('[UploadService] Cloudinary Error:', error);
          return reject(error);
        }
        console.log('[UploadService] Upload Success! URL:', result.secure_url);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};
