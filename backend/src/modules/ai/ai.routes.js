import express from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { protect } from '../../middleware/auth.middleware.js';
import { scoreResume } from './ai.controller.js';
import { resumeScoreSchema } from './ai.validation.js';

const router = express.Router();

router.post('/score', protect, validate(resumeScoreSchema), scoreResume);

export default router;
