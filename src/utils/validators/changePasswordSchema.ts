// utils/validators/changePasswordSchema.ts
import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
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
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden',
  });

export type ChangePasswordFields = z.infer<typeof changePasswordSchema>;
