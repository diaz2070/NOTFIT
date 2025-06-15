import { useState } from 'react';
import type { LoggedExercise } from '@/types/routine';

type WorkoutStatus = 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED';

interface UseWorkoutLogState {
  workoutStatus: WorkoutStatus;
  setWorkoutStatus: (status: WorkoutStatus) => void;

  pausedAt: Date | null;
  setPausedAt: (date: Date | null) => void;

  logId: string | null;
  setLogId: (id: string | null) => void;

  selectedRoutine: string;
  setSelectedRoutine: (id: string) => void;

  startTime: Date;
  setStartTime: (t: Date) => void;

  generalNotes: string;
  setGeneralNotes: (notes: string) => void;

  workoutData: LoggedExercise[];
  setWorkoutData: React.Dispatch<React.SetStateAction<LoggedExercise[]>>;

  resetLogState: () => void;
}

export default function useWorkoutLogState(): UseWorkoutLogState {
  const [workoutStatus, setWorkoutStatus] =
    useState<WorkoutStatus>('IN_PROGRESS');
  const [pausedAt, setPausedAt] = useState<Date | null>(null);
  const [logId, setLogId] = useState<string | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [generalNotes, setGeneralNotes] = useState('');
  const [workoutData, setWorkoutData] = useState<LoggedExercise[]>([]);

  function resetLogState() {
    setWorkoutStatus('IN_PROGRESS');
    setPausedAt(null);
    setLogId(null);
    setSelectedRoutine('');
    setStartTime(new Date());
    setGeneralNotes('');
    setWorkoutData([]);
  }

  return {
    workoutStatus,
    setWorkoutStatus,
    pausedAt,
    setPausedAt,
    logId,
    setLogId,
    selectedRoutine,
    setSelectedRoutine,
    startTime,
    setStartTime,
    generalNotes,
    setGeneralNotes,
    workoutData,
    setWorkoutData,
    resetLogState,
  };
}
