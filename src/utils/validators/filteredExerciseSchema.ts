import { z } from 'zod';

export const ExerciseCategoryEnum = z.enum([
  'Chest',
  'Back',
  'Upper_Legs',
  'Lower_Legs',
  'Shoulders',
  'Upper_Arms',
  'Lower_Arms',
  'Waist',
  'Cardio',
  'Neck',
]);

export type ExerciseCategory = z.infer<typeof ExerciseCategoryEnum>;

export const MuscleTargetEnum = z.enum([
  'Abductors',
  'Abs',
  'Adductors',
  'Biceps',
  'Calves',
  'Cardiovascular_System',
  'Delts',
  'Forearms',
  'Glutes',
  'Hamstrings',
  'Lats',
  'Levator_Scapulae',
  'Pectorals',
  'Quads',
  'Serratus_Anterior',
  'Spine',
  'Traps',
  'Triceps',
  'Upper_Back',
]);
export type MuscleTarget = z.infer<typeof MuscleTargetEnum>;

export const filteredExerciseSchema = z.object({
  search: z.string().default(''),
  category: z.union([ExerciseCategoryEnum, z.literal('all')]).default('all'),
  muscle: z.union([MuscleTargetEnum, z.literal('all')]).default('all'),
  sort: z.enum(['name', 'category']).default('name'),
  take: z.number().min(1).max(50).default(10),
  page: z.number().min(1).default(1),
});

export type FilteredExerciseInput = z.infer<typeof filteredExerciseSchema>;
