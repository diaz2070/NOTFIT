import { z } from 'zod';

export type SignUpFormFields = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type SignInFormFields = {
  email: string;
  password: string;
};

export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(50, { message: 'Name must not exceed 50 characters' })
    .regex(/^[a-zA-ZÀ-ÿ' -]+$/, {
      message:
        'Name can only contain letters, spaces, hyphens, and apostrophes',
    }),
  username: z
    .string()
    .min(1, { message: 'Username is required' })
    .max(20, { message: 'Username must not exceed 20 characters' })
    .regex(/^\w+$/, {
      message: 'Username can only contain letters, numbers, and underscores',
    }),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .min(1, { message: 'Email is required' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(64, { message: 'Password must not exceed 64 characters' })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/\d/, { message: 'Password must contain at least one digit' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character',
    }),
});

export const signInSchema = signUpSchema.pick({
  email: true,
  password: true,
});
