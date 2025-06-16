import { RoutineExerciseDraft } from '@/types/routine';

export default function isRoutineValid(
  routineName: string,
  selectedDays: string[],
  exercises: RoutineExerciseDraft[],
): boolean {
  if (typeof routineName !== 'string' || routineName.trim().length === 0) {
    return false;
  }

  if (!Array.isArray(selectedDays) || selectedDays.length === 0) {
    return false;
  }

  if (!Array.isArray(exercises) || exercises.length === 0) {
    return false;
  }

  return exercises.every(
    (exercise) =>
      typeof exercise.name === 'string' &&
      exercise.name.trim().length > 0 &&
      typeof exercise.sets === 'number' &&
      exercise.sets > 0 &&
      typeof exercise.reps === 'number' &&
      exercise.reps > 0 &&
      typeof exercise.weight === 'number' &&
      exercise.weight >= 0 &&
      (typeof exercise.notes === 'string'
        ? exercise.notes.length <= 300
        : true),
  );
}
