'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import deleteWorkoutLogAction from '@/actions/deleteWorkoutLog';

const useDeleteWorkoutLog = (onSuccess?: () => void) => {
  const [isPending, startTransition] = useTransition();

  const deleteWorkoutLog = (workoutId: string, userId: string) => {
    startTransition(async () => {
      const result = await deleteWorkoutLogAction(workoutId, userId);
      if (result.success) {
        toast.success('Workout deleted successfully');
        onSuccess?.();
      } else {
        toast.error(result.errorMessage || 'Could not delete workout');
      }
    });
  };

  return { deleteWorkoutLog, isPending };
};

export default useDeleteWorkoutLog;
