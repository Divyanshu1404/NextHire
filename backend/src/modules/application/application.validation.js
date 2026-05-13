import { z } from 'zod';
import { APPLICATION_STATUS } from '../../constants/status.js';

export const applyJobSchema = z.object({
  body: z.object({
    jobId: z.string().min(1, 'Job ID is required'),
    resumeUrl: z.string().min(1, 'Resume URL is required'),
    coverLetter: z.string().optional()
  })
});

export const updateApplicationStatusSchema = z.object({
  body: z.object({
    status: z.enum(Object.values(APPLICATION_STATUS)),
    assessmentLink: z.string().url().optional()
  })
});
