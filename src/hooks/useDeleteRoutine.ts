'use client';

import { useTransition } from 'react';
import deleteRoutineAction from '@/actions/deleteRoutine';
import { toast } from 'sonner';

const useDeleteRoutine = (onSuccess?: () => void) => {
  const [isPending, startTransition] = useTransition();

  const deleteRoutine = (routineId: string, userId: string) => {
    startTransition(async () => {
      const result = await deleteRoutineAction(routineId, userId);
      if (result.success) {
        toast.success('Routine deleted successfully');
        onSuccess?.();
      } else {
        toast.error(result.errorMessage || 'Could not delete routine');
      }
    });
  };

  return { deleteRoutine, isPending };
};

export default useDeleteRoutine;
