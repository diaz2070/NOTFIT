'use server';

import { prisma } from '@/db/prisma';
import handleError from '@/utils/handle';
import { Routine, RoutineExercise, Exercise } from '@prisma/client';

export type RoutineWithExercises = Routine & {
  exercises: (RoutineExercise & {
    exercise: Exercise;
  })[];
};

type GetRoutinesResult = {
  status: number;
  data: RoutineWithExercises[] | null;
  errorMessage: string | null;
};

const getRoutinesAction = async (
  userId: string,
): Promise<GetRoutinesResult> => {
  try {
    if (!userId) {
      return {
        status: 400,
        data: null,
        errorMessage: 'Missing user ID',
      };
    }

    const routines = await prisma.routine.findMany({
      where: { userId },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    return {
      status: 200,
      data: routines,
      errorMessage: null,
    };
  } catch (error) {
    const errorResult = handleError(error);
    return { ...errorResult, data: null };
  }
};

export default getRoutinesAction;
