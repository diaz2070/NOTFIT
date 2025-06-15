import { z } from 'zod';

export const userInfoSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(50, { message: 'Name must not exceed 50 characters' })
    .regex(/^[a-zA-ZÀ-ÿ' -]+$/, {
      message:
        'Name can only contain letters, spaces, hyphens, and apostrophes',
    }),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .min(1, { message: 'Email is required' }),
  username: z
    .string()
    .min(1, { message: 'Username is required' })
    .max(20, { message: 'Username must not exceed 20 characters' })
    .regex(/^\w+$/, {
      message: 'Username can only contain letters, numbers, and underscores',
    }),
});

export type UserInfoFields = z.infer<typeof userInfoSchema>;
