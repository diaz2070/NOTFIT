import { DayOfWeek } from '@prisma/client';
import { z } from 'zod';

export const RoutineExerciseDraftSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Exercise name is required'),
  sets: z.number().min(1, 'Sets must be greater than 0'),
  reps: z.number().min(1, 'Reps must be greater than 0'),
  weight: z.number().min(0, 'Weight must be 0 or more'),
  notes: z.string().optional(),
  imageUrl: z.string().url(),
});

export const routineSchema = z.object({
  routineName: z.string().min(1, 'Routine name is required'),
  selectedDays: z
    .array(z.enum([...Object.values(DayOfWeek)] as [string, ...string[]]))
    .min(1, 'At least one day of the week must be selected'),
  exercises: z
    .array(RoutineExerciseDraftSchema)
    .min(1, 'At least one exercise is required'),
});

export type RoutineFormFields = z.infer<typeof routineSchema>;
