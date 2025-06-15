import type { LoggedExercise } from '@/types/routine';

export default function isWorkoutValid(workoutData: LoggedExercise[]): boolean {
  return workoutData.every((exercise) =>
    exercise.completedSets.every(
      (set) =>
        typeof set.reps === 'number' &&
        set.reps > 0 &&
        typeof set.weight === 'number' &&
        set.weight >= 0,
    ),
  );
}
