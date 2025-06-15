import { startWorkoutLog } from '@/actions/workoutLog';
import type { RoutineWithExercises, LoggedExercise } from '@/types/routine';
import Cookies from 'js-cookie';

interface UseRoutineSelectionParams {
  routines: RoutineWithExercises[];
  setSelectedRoutine: (id: string) => void;
  setLogId: (id: string) => void;
  setWorkoutData: (data: LoggedExercise[]) => void;
  setStartTime: (time: Date) => void;
}

export default function useRoutineSelection({
  routines,
  setSelectedRoutine,
  setLogId,
  setWorkoutData,
  setStartTime,
}: UseRoutineSelectionParams) {
  const handleRoutineSelect = async (routineId: string) => {
    setSelectedRoutine(routineId);

    setStartTime(new Date());
    const routine = routines.find((r) => r.id === routineId);
    if (!routine) return;

    const { data } = await startWorkoutLog(routineId);
    if (!data?.logId) return;
    const id = data.logId;
    setLogId(id);
    Cookies.set('activeWorkoutLogId', id);

    const exercises: LoggedExercise[] = routine.exercises.map((re, index) => ({
      exerciseId: re.exercise.id,
      exerciseName: re.exercise.name,
      targetSets: re.sets,
      targetReps: re.reps,
      targetWeight: re.targetWeight ?? 0,
      completedSets: Array.from({ length: re.sets }, () => ({
        reps: re.reps,
        weight: re.targetWeight ?? 0,
        completed: false,
      })),
      order: index,
    }));

    setWorkoutData(exercises);
  };

  return { handleRoutineSelect };
}
