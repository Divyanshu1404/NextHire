import { z } from 'zod';

export const resumeScoreSchema = z.object({
  body: z.object({
    resumeText: z.string().min(1),
    jobDescription: z.string().min(1),
  }),
});
