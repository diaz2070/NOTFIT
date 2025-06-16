'use server';

import { getUser } from '@/auth/server';
import { prisma } from '@/db/prisma';
import handleError from '@/utils/handle';
import {
  RoutineFormFields,
  routineSchema,
} from '@/utils/validators/routineSchema';
import { Routine, RoutineExercise, Exercise, DayOfWeek } from '@prisma/client';

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

export const getRoutinesAction = async (
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

export async function createRoutineAction(
  formData: RoutineFormFields,
): Promise<{
  status: number;
  errorMessage: string | null;
  data: { id: string } | null;
}> {
  const validation = routineSchema.safeParse(formData);
  if (!validation.success) {
    return {
      status: 400,
      errorMessage: validation.error.errors
        .map(
          (
            e:
              | { message: string; path: string[] }
              | { message: string; code: string },
          ) => e.message,
        )
        .join(', '),
      data: null,
    };
  }

  const user = await getUser();
  if (!user)
    return {
      status: 401,
      errorMessage: 'Unauthorized',
      data: null,
    };

  try {
    const parsedDays = formData.selectedDays.filter((day): day is DayOfWeek =>
      Object.values(DayOfWeek).includes(day as DayOfWeek),
    );
    const routine = await prisma.routine.create({
      data: {
        userId: user.id,
        name: formData.routineName,
        daysOfWeek: parsedDays,
        exercises: {
          create: formData.exercises.map((ex, index) => ({
            exerciseId: ex.id,
            sets: ex.sets,
            reps: ex.reps,
            targetWeight: ex.weight ?? 0,
            note: ex.notes ?? '',
            order: index,
          })),
        },
      },
      select: {
        id: true,
      },
    });

    return {
      status: 200,
      errorMessage: null,
      data: routine,
    };
  } catch (error) {
    const result = handleError(error);
    return { ...result, data: null };
  }
}

export async function getRoutineById(
  id: string,
): Promise<RoutineWithExercises | null> {
  try {
    const routine = await prisma.routine.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    return routine;
  } catch (error) {
    return null;
  }
}

export async function updateRoutineAction(
  id: string,
  formData: RoutineFormFields,
): Promise<{ status: number; errorMessage: string | null }> {
  const validation = routineSchema.safeParse(formData);
  if (!validation.success) {
    return {
      status: 400,
      errorMessage: validation.error.errors.map((e) => e.message).join(', '),
    };
  }

  const user = await getUser();
  if (!user) {
    return {
      status: 401,
      errorMessage: 'Unauthorized',
    };
  }

  try {
    const parsedDays = formData.selectedDays.filter((day): day is DayOfWeek =>
      Object.values(DayOfWeek).includes(day as DayOfWeek),
    );

    await prisma.routineExercise.deleteMany({
      where: { routineId: id },
    });

    await prisma.routine.update({
      where: { id },
      data: {
        name: formData.routineName,
        daysOfWeek: parsedDays,
        exercises: {
          create: formData.exercises.map((ex, index) => ({
            exerciseId: ex.id,
            sets: ex.sets,
            reps: ex.reps,
            targetWeight: ex.weight,
            note: ex.notes,
            order: index,
          })),
        },
      },
    });

    return {
      status: 200,
      errorMessage: null,
    };
  } catch (error) {
    return {
      status: 500,
      errorMessage: 'Failed to update routine',
    };
  }
}
