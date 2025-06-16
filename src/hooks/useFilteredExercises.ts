'use client';

import { useEffect, useState, useTransition } from 'react';
import getExercisesAction from '@/actions/exercises';
import { Exercise } from '@prisma/client';
import {
  filteredExerciseSchema,
  FilteredExerciseInput,
} from '@/utils/validators/filteredExerciseSchema';
import { toast } from 'sonner';

export default function useFilteredExercises(open: boolean) {
  const [filters, setFilters] = useState<FilteredExerciseInput>(
    filteredExerciseSchema.parse({
      search: '',
      category: 'all',
      muscle: 'all',
      sort: 'name',
      take: 6,
      page: 1,
    }),
  );
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isPending, startTransition] = useTransition();
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!open) return;
    startTransition(() => {
      getExercisesAction(filters).then((result) => {
        if (result.status === 200 && result.data) {
          setExercises(result.data.items);
          setTotalPages(Math.ceil(result.data.total / filters.take));
        } else if (result.status === 404) {
          setExercises([]);
          setTotalPages(1);
        } else {
          toast.error('Failed to fetch exercises', {
            description: result.errorMessage ?? 'Please try again later.',
            duration: 6000,
          });
        }
      });
    });
  }, [filters, open]);

  const updateFilter = <K extends keyof FilteredExerciseInput>(
    key: K,
    value: FilteredExerciseInput[K],
  ) => {
    setFilters((prev) =>
      filteredExerciseSchema.parse({
        ...prev,
        [key]: value,
        page: 1,
      }),
    );
  };

  const clearFilters = () => setFilters(filteredExerciseSchema.parse({}));

  const nextPage = () => {
    setFilters((prev) =>
      filteredExerciseSchema.parse({
        ...prev,
        page: prev.page + 1,
      }),
    );
  };

  const prevPage = () => {
    setFilters((prev) =>
      filteredExerciseSchema.parse({
        ...prev,
        page: Math.max(1, prev.page - 1),
      }),
    );
  };

  return {
    exercises,
    filters,
    updateFilter,
    clearFilters,
    isPending,
    page: filters.page,
    totalPages,
    nextPage,
    prevPage,
  };
}
