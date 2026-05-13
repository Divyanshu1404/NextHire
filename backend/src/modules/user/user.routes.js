import express from 'express';
import { getProfile, updateProfile } from './user.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { updateProfileSchema } from './user.validation.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, validate(updateProfileSchema), updateProfile);

export default router;
