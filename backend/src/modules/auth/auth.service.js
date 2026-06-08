import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/generateToken.js';
import { ROLES } from '../../constants/roles.js';
import * as userRepository from '../../repositories/user.repository.js';

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
