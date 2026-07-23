import express from 'express';
import { register, login, getMe, google } from './auth.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { registerSchema, loginSchema, googleSchema } from './auth.validation.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/register', (req, res) => {
  res.status(405).json({
    success: false,
    message: 'The register endpoint only accepts POST requests. Please use an API client like Postman or Thunder Client to send a POST request with your user details in the body.'
  });
});
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/google', validate(googleSchema), google);
router.get('/me', protect, getMe);

export default router;
