import { z } from 'zod';
import { ROLE_HIERARCHY } from '../../constants/roles.js';

export const registerCompanySchema = z.object({
  body: z.object({
    companyName: z.string().min(2, 'Company name is required'),
    email: z.string().email('Invalid email address'),
    website: z.string().url('Must be a valid URL').optional(),
    registrationNumber: z.string().min(2, 'Registration number is required'),
    kycDocumentUrl: z.string().url('KYC Document URL is required')
  })
});

export const addTeamMemberSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    role: z.enum(['hr', 'manager', 'recruiter'], { 
      errorMap: () => ({ message: 'Role must be hr, manager, or recruiter' }) 
    })
  })
});

export const updateCompanySchema = z.object({
  body: z.object({
    companyName: z.string().min(2).optional(),
    email: z.string().email('Invalid email address').optional(),
    website: z.string().url('Must be a valid URL').optional(),
    registrationNumber: z.string().min(2).optional(),
    kycDocumentUrl: z.string().url().optional(),
    logoUrl: z.string().url('Logo must be a valid URL').optional()
  })
});
