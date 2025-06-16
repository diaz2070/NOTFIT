'use client';

import { useEffect, useState, useTransition } from 'react';
import { getRoutinesAction, RoutineWithExercises } from '@/actions/routines';

import { toast } from 'sonner';

export default function useRoutines(userId?: string, open = true) {
  const [routines, setRoutines] = useState<RoutineWithExercises[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open || !userId) return;

    startTransition(() => {
      getRoutinesAction(userId).then((result) => {
        if (result.status === 200 && result.data) {
          setRoutines(result.data);
        } else {
          toast.error('Error al cargar rutinas', {
            description: result.errorMessage ?? 'Inténtalo de nuevo.',
            duration: 6000,
          });
        }
      });
    });
  }, [open, userId]);

  return { routines, isPending, setRoutines };
}
