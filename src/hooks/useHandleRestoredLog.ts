import { useEffect } from 'react';
import { ApiResponse } from '@/actions/workoutLog';
import { WorkoutLogWithEntries, LoggedExercise } from '@/types/routine';
import transformWorkoutLogToExercises from '@/utils/transformWorkoutEntries';

interface UseHandleRestoredLogProps {
  restoredLog: ApiResponse<WorkoutLogWithEntries | null> | null;
  setters: {
    setWorkoutData: (data: LoggedExercise[]) => void;
    setLogId: (id: string) => void;
    setSelectedRoutine: (id: string) => void;
    setStatus: (status: 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED') => void;
    setPausedAt: (d: Date | null) => void;
    setNotes: (notes: string) => void;
    setStartTime: (t: Date) => void;
  };
}

export default function useHandleRestoredLog({
  restoredLog,
  setters,
}: UseHandleRestoredLogProps) {
  const {
    setWorkoutData,
    setLogId,
    setSelectedRoutine,
    setStatus,
    setPausedAt,
    setNotes,
    setStartTime,
  } = setters;

  useEffect(() => {
    if (!restoredLog?.data) return;

    const log = restoredLog.data;
    setLogId(log.id);
    setSelectedRoutine(log.routineId);
    setStatus(log.status);
    setPausedAt(log.pausedAt ? new Date(log.pausedAt) : null);
    setNotes(log.comment ?? '');
    setStartTime(log.startTime ? new Date(log.startTime) : new Date());
    setWorkoutData(transformWorkoutLogToExercises(log));
  }, [restoredLog]);
}
