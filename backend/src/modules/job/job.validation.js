import { z } from 'zod';

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    skillsRequired: z.array(z.string()).min(1, 'At least one skill is required'),
    location: z.string().min(2, 'Location is required'),
    salaryRange: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      currency: z.string().default('INR')
    }).optional(),
    jobType: z.enum(['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']).default('Full-time'),
    experienceLevel: z.enum(['Entry', 'Mid', 'Senior', 'Executive']).default('Entry')
  })
});

export const updateJobSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    skillsRequired: z.array(z.string()).optional(),
    location: z.string().min(2).optional()
  })
});
