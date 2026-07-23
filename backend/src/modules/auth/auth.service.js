import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/generateToken.js';
import { ROLES } from '../../constants/roles.js';
import * as userRepository from '../../repositories/user.repository.js';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../../config/env.js';

export const registerUser = async (userData) => {
  const { name, email, password, role } = userData;

  const userExists = await userRepository.findByEmail(email);
  if (userExists) {
    const error = new Error('User already exists');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userRepository.create({
    name,
    email,
    password: hashedPassword,
    role: role || ROLES.USER,
    companyId: null
  });

  const token = generateToken(user._id, user.role);
  
  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId
    },
    token
  };
};

export const loginUser = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id, user.role);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId
    },
    token
  };
};

export const googleLogin = async (idToken) => {
  if (!idToken) {
    const error = new Error('Missing idToken');
    error.statusCode = 400;
    throw error;
  }

  const client = new OAuth2Client(config.googleClientId);
  let ticket;
  try {
    ticket = await client.verifyIdToken({ idToken, audience: config.googleClientId });
  } catch (err) {
    const error = new Error('Invalid Google ID token');
    error.statusCode = 401;
    throw error;
  }

  const payload = ticket.getPayload();
  const googleId = payload.sub;
  const email = payload.email;
  const name = payload.name || '';
  const avatar = payload.picture || '';

  if (!email) {
    const error = new Error('Google account missing email');
    error.statusCode = 400;
    throw error;
  }

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    // Disallow non-job-seeker roles from using Google auth
    if (existing.role && existing.role !== ROLES.USER) {
      const error = new Error('Please login using your email and password for this account');
      error.statusCode = 400;
      throw error;
    }

    // Update existing job seeker
    await userRepository.findOneAndUpdate({ _id: existing._id }, { googleId, avatar, authProvider: 'google' });
    const user = await userRepository.findById(existing._id);
    const token = generateToken(user._id, user.role);
    return { user: { _id: user._id, name: user.name, email: user.email, role: user.role, companyId: user.companyId }, token };
  }

  // Create new job seeker
  const created = await userRepository.create({
    name,
    email,
    password: '',
    role: ROLES.USER,
    companyId: null,
    googleId,
    avatar,
    authProvider: 'google'
  });

  const token = generateToken(created._id, created.role);
  return { user: { _id: created._id, name: created.name, email: created.email, role: created.role, companyId: created.companyId }, token };
};
