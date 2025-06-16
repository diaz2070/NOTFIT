import type { WorkoutLogWithEntries, LoggedExercise } from '@/types/routine';

export default function transformWorkoutLogToExercises(
  log: WorkoutLogWithEntries,
): LoggedExercise[] {
  const restored: LoggedExercise[] = log.entries.reduce<LoggedExercise[]>(
    (acc, entry) => {
      let target = acc.find((e) => e.exerciseId === entry.exerciseId);
      const routineExercise = entry.exercise.routines[0];

      if (!target) {
        target = {
          exerciseId: entry.exerciseId,
          exerciseName: entry.exercise.name,
          targetSets: routineExercise?.sets ?? 0,
          targetReps: routineExercise?.reps ?? 0,
          targetWeight: routineExercise?.targetWeight ?? 0,
          completedSets: [],
          order: routineExercise?.order ?? 999,
        };
        acc.push(target);
      }

      target.completedSets.push({
        reps: entry.reps,
        weight: entry.weight,
        completed: entry.completed,
        entryId: entry.id,
      });

      return acc;
    },
    [],
  );

  return restored.sort((a, b) => a.order - b.order);
}
