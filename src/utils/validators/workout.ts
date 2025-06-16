import type { LoggedExercise } from '@/types/routine';

export default function isWorkoutValid(workoutData: LoggedExercise[]): boolean {
  const hasAtLeastOneCompletedSet = workoutData.some((exercise) =>
    exercise.completedSets.some((set) => set.completed),
  );

  if (!hasAtLeastOneCompletedSet) return false;

  return workoutData.every((exercise) =>
    exercise.completedSets
      .filter((set) => set.completed)
      .every(
        (set) =>
          typeof set.reps === 'number' &&
          set.reps > 0 &&
          typeof set.weight === 'number' &&
          set.weight >= 0,
      ),
  );
}
