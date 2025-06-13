'use server';

import { prisma } from '@/db/prisma';
import handleError from '@/utils/handle';
import {
  filteredExerciseSchema,
  FilteredExerciseInput,
} from '@/utils/validators/filteredExerciseSchema';
import { Exercise } from '@prisma/client';

type GetExercisesResult = {
  status: number;
  data: { items: Exercise[]; total: number } | null;
  errorMessage: string | null;
};

const getExercisesAction = async (
  filters: FilteredExerciseInput,
): Promise<GetExercisesResult> => {
  try {
    const validation = filteredExerciseSchema.safeParse(filters);
    if (!validation.success) {
      return {
        status: 400,
        data: null,
        errorMessage: `Invalid input: ${validation.error.message}`,
      };
    }

    const skipPages = (filters.page - 1) * filters.take;

    const exercises = await prisma.exercise.findMany({
      where: {
        name: {
          contains: filters.search,
          mode: 'insensitive',
        },
        category:
          filters.category && filters.category !== 'all'
            ? filters.category
            : undefined,
        primaryMuscles:
          filters.muscle && filters.muscle !== 'all'
            ? {
                has: filters.muscle,
              }
            : undefined,
      },
      orderBy: [
        {
          [filters.sort]: 'asc',
        },
      ],
      take: filters.take,
      skip: skipPages,
    });

    if (!exercises || exercises.length === 0) {
      return {
        status: 404,
        data: null,
        errorMessage: 'No exercises found',
      };
    }

    const total = await prisma.exercise.count({
      where: {
        name: {
          contains: filters.search,
          mode: 'insensitive',
        },
        category:
          filters.category && filters.category !== 'all'
            ? filters.category
            : undefined,
        primaryMuscles:
          filters.muscle && filters.muscle !== 'all'
            ? {
                has: filters.muscle,
              }
            : undefined,
      },
    });

    return {
      status: 200,
      data: {
        items: exercises,
        total,
      },
      errorMessage: null,
    };
  } catch (error) {
    const errorResult = handleError(error);
    return { ...errorResult, data: null };
  }
};

export default getExercisesAction;
