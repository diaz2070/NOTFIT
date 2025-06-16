'use client';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import useLogResponse from '@/hooks/useLogAPIResponse';
import useWorkoutLogState from '@/hooks/useWorkoutLogState';
import useWorkoutLogController from '@/hooks/useWorkoutLogController';
import useRoutineSelection from '@/hooks/useRoutineSelection';
import useHandleRestoredLog from '@/hooks/useHandleRestoredLog';
import isWorkoutValid from '@/utils/validators/workout';
import useIsBusy from '@/hooks/useIsBusy';

import type {
  RoutineWithExercises,
  WorkoutLogWithEntries,
} from '@/types/routine';

import {
  deleteWorkoutLog,
  pauseWorkoutLog,
  resumeWorkoutLog,
  saveWorkoutLog,
  type ApiResponse,
} from '@/actions/workoutLog';

import editWorkoutLog from '@/actions/editWorkoutLog';

export default function useWorkoutLog(
  routines: RoutineWithExercises[],
  restoredLog: ApiResponse<WorkoutLogWithEntries | null> | null,
) {
  const router = useRouter();

  const {
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
  } = useWorkoutLogState();

  const { isPending: isPausing, mutate: pauseWorkout } = useLogResponse(
    pauseWorkoutLog,
    {
      success: 'Workout paused',
      error: 'Failed to pause workout',
    },
  );

  const { isPending: isResuming, mutate: resumeWorkout } = useLogResponse(
    resumeWorkoutLog,
    {
      success: 'Workout resumed',
      error: 'Failed to resume workout',
    },
  );

  const { isPending: isDiscardingRoutine, mutate: discardRoutine } =
    useLogResponse(deleteWorkoutLog, {
      success: 'Changing routine...',
      error: 'Failed to discard routine',
    });

  const { isPending: isDeleting, mutate: deleteWorkout } = useLogResponse(
    deleteWorkoutLog,
    {
      success: 'Workout log deleted',
      error: 'Failed to delete log',
    },
  );

  const { isPending: isSaving, mutate: saveWorkout } = useLogResponse(
    saveWorkoutLog,
    {
      success: 'Workout log saved successfully',
      error: 'Failed to save log',
    },
  );

  const isBusy = useIsBusy(
    isPausing,
    isResuming,
    isDiscardingRoutine,
    isDeleting,
    isSaving,
  );

  const { handleRoutineSelect } = useRoutineSelection({
    routines,
    setSelectedRoutine,
    setLogId,
    setWorkoutData,
    setStartTime,
  });

  const {
    updateSet,
    toggleSetComplete,
    getCompletedSets,
    getTotalCompletedSets,
    getTotalSets,
  } = useWorkoutLogController({ setWorkoutData, workoutData });

  useHandleRestoredLog({
    restoredLog,
    setters: {
      setWorkoutData,
      setLogId,
      setSelectedRoutine,
      setStatus: setWorkoutStatus,
      setPausedAt,
      setNotes: setGeneralNotes,
      setStartTime,
    },
  });

  const handlers = {
    handlePauseWorkout: async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setPausedAt(new Date());

      const formData = new FormData();
      formData.append('log', JSON.stringify({ logId, workoutData }));

      const result = await pauseWorkout(null, formData);
      if (result.status === 200) setWorkoutStatus('PAUSED');
    },

    handleResumeWorkout: async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setPausedAt(null);

      const result = await resumeWorkout(logId!);
      if (result.status === 200) setWorkoutStatus('IN_PROGRESS');
    },

    handleChangeRoutine: async () => {
      Cookies.remove('activeWorkoutLogId');
      if (logId) await discardRoutine(logId);
      resetLogState();
    },

    handleDiscard: async () => {
      if (logId) {
        Cookies.remove('activeWorkoutLogId');
        const res = await deleteWorkout(logId);
        if (res.status === 200) resetLogState();
      }
    },

    handleSubmitLog: async (e: React.FormEvent) => {
      e.preventDefault();

      if (workoutStatus === 'PAUSED') {
        toast.warning('Cannot finish a paused workout. Resume it first.');
        return;
      }

      if (!isWorkoutValid(workoutData)) {
        toast.error('Please complete all sets with valid reps and weight.');
        return;
      }

      Cookies.remove('activeWorkoutLogId');

      if (restoredLog?.data) {
        await editWorkoutLog(restoredLog.data.id, {
          notes: generalNotes,
          entries: workoutData.flatMap((ex) =>
            ex.completedSets
              .filter((set) => set.entryId !== undefined)
              .map((set) => ({
                id: set.entryId!,
                reps: set.reps,
                weight: set.weight,
                completed: set.completed,
              })),
          ),
        });

        router.push('/history');
        return;
      }

      const formData = new FormData();
      const endTime = new Date();

      const payload = {
        logId,
        routineId: selectedRoutine,
        startTime,
        endTime,
        status: 'COMPLETED',
        notes: generalNotes,
        workoutData,
      };

      formData.append('log', JSON.stringify(payload));

      const result = await saveWorkout(null, formData);

      if (result.status === 200) {
        router.push('/history');
      } else {
        toast.error(
          `Failed to save log: ${result.errorMessage ?? 'Unknown error'}`,
        );
      }
    },
  };

  return {
    workoutState: {
      workoutStatus,
      pausedAt,
      selectedRoutine,
      startTime,
      generalNotes,
      workoutData,
      isSaving,
      isDeleting,
      isDiscardingRoutine,
      isResuming,
      isPausing,
    },
    controller: {
      updateSet,
      toggleSetComplete,
      getCompletedSets,
      getTotalCompletedSets,
      getTotalSets,
      setGeneralNotes,
    },
    handlers,
    isBusy,

    availableRoutines: routines.map((r) => ({
      id: r.id,
      name: r.name,
      days: r.daysOfWeek,
    })),
    handleRoutineSelect,
  };
}
