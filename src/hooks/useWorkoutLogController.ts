import { LoggedExercise } from '@/types/routine';

interface WorkoutLogControllerProps {
  setWorkoutData: React.Dispatch<React.SetStateAction<LoggedExercise[]>>;
  workoutData: LoggedExercise[];
}

export default function useWorkoutLogController({
  setWorkoutData,
  workoutData,
}: WorkoutLogControllerProps) {
  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: 'reps' | 'weight' | 'completed',
    value: number | boolean,
  ) => {
    if (
      field !== 'completed' &&
      typeof value === 'number' &&
      Number.isNaN(value)
    )
      return;

    setWorkoutData((prev) => {
      const updated = structuredClone(prev);
      const set = updated[exerciseIndex].completedSets[setIndex];

      if (field === 'reps' || field === 'weight') {
        set[field] = value as number;
      } else if (field === 'completed') {
        set[field] = value as boolean;
      }

      return updated;
    });
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    const current =
      workoutData[exerciseIndex].completedSets[setIndex].completed;
    updateSet(exerciseIndex, setIndex, 'completed', !current);
  };

  const getCompletedSets = (exercise: LoggedExercise) =>
    exercise.completedSets.filter((set) => set.completed).length;

  const getTotalCompletedSets = () =>
    workoutData.reduce((total, ex) => total + getCompletedSets(ex), 0);

  const getTotalSets = () =>
    workoutData.reduce((total, ex) => total + ex.targetSets, 0);

  return {
    updateSet,
    toggleSetComplete,
    getCompletedSets,
    getTotalCompletedSets,
    getTotalSets,
  };
}
