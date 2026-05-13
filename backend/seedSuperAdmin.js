import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './src/models/user.model.js';
import { config } from './src/config/env.js';

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    const email = 'superadmin@nexthire.com';
    const password = 'Aman@123';

    // Check if super admin already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Super Admin already exists!');
      console.log(`Email: ${email}`);
      console.log(`Role: ${existing.role}`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const superAdmin = await User.create({
      name: 'Super Admin',
      email,
      password: hashedPassword,
      role: 'super_admin',
      companyId: null
    });

    console.log('✅ Super Admin created successfully!');
    console.log('-----------------------------------');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     ${superAdmin.role}`);
    console.log('-----------------------------------');
    console.log('Use these credentials to login at /employer/login');

    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error.message);
    process.exit(1);
  }
};

createSuperAdmin();
