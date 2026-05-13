import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    skills: z.array(z.string()).optional(),
    education: z.array(z.string()).optional(),
    resumeUrl: z.string().url().optional()
  })
});
