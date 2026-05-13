import express from 'express';
import { uploadFileHandler } from './upload.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';

const router = express.Router();

router.post('/', protect, upload.single('file'), uploadFileHandler);

export default router;
