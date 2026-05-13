import { z } from 'zod';
const ROLE_HIERARCHY = ['user', 'admin'];
const schema = z.object({
  body: z.object({
    role: z.enum(ROLE_HIERARCHY).optional()
  })
});
try {
  schema.parse({ body: { role: 'superadmin' } });
} catch (e) {
  console.log('Is ZodError:', e instanceof z.ZodError);
  console.log('e.errors:', e.errors);
  console.log('e.issues:', e.issues);
}
