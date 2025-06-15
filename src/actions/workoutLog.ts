'use server';

import { getUser } from '@/auth/server';
import { prisma } from '@/db/prisma';
import {
  CompletedSet,
  LoggedExercise,
  WorkoutLogWithEntries,
} from '@/types/routine';
import handleError from '@/utils/handle';
import { WorkoutLog } from '@prisma/client';

export type ApiResponse<T> = {
  status: number;
  errorMessage: string;
  data: T | null;
};

export async function startWorkoutLog(
  routineId: string,
): Promise<ApiResponse<{ logId: string }>> {
  const user = await getUser();
  if (!user) throw new Error('Not authenticated');

  try {
    const log = await prisma.workoutLog.create({
      data: {
        userId: user.id,
        routineId,
        startTime: new Date(),
        status: 'IN_PROGRESS',
      },
    });

    return {
      status: 200,
      errorMessage: 'Workout log started',
      data: { logId: log.id },
    };
  } catch (error) {
    const errorResult = handleError(error);
    return { ...errorResult, data: null };
  }
}

export async function saveWorkoutLog(
  _state: ApiResponse<{ logId: string }> | null,
  formData: FormData,
): Promise<ApiResponse<{ logId: string }>> {
  const user = await getUser();
  if (!user)
    return { status: 401, errorMessage: 'Not authenticated', data: null };

  try {
    const payload = JSON.parse(formData.get('log') as string);
    const { logId, routineId, startTime, endTime, notes, workoutData } =
      payload;

    await prisma.workoutLogEntry.deleteMany({ where: { logId } });

    await prisma.workoutLog.update({
      where: { id: logId, userId: user.id },
      data: {
        routine: {
          connect: { id: routineId },
        },
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: 'COMPLETED',
        comment: notes,
        entries: {
          create: workoutData
            .sort((a: LoggedExercise, b: LoggedExercise) => a.order - b.order)
            .flatMap((exercise: LoggedExercise) =>
              exercise.completedSets.map(
                (set: CompletedSet, setIndex: number) => ({
                  exerciseId: exercise.exerciseId,
                  setNumber: setIndex + 1,
                  weight: set.weight,
                  reps: set.reps,
                  completed: set.completed,
                  completedSets: JSON.stringify(exercise.completedSets),
                }),
              ),
            ),
        },
      },
    });

    return { status: 200, errorMessage: 'Workout log saved', data: { logId } };
  } catch (error) {
    const errorResult = handleError(error);
    return { ...errorResult, data: null };
  }
}

export async function pauseWorkoutLog(
  _prevState: ApiResponse<WorkoutLog> | null,
  formData: FormData,
): Promise<ApiResponse<WorkoutLog>> {
  const user = await getUser();
  if (!user)
    return { status: 401, errorMessage: 'Not authenticated', data: null };

  try {
    const payload = JSON.parse(formData.get('log') as string);
    const { logId, workoutData } = payload;

    const log = await prisma.workoutLog.findUnique({
      where: { id: logId, userId: user.id },
    });
    if (!log)
      return { status: 404, errorMessage: 'Workout log not found', data: null };

    if (log.pausedAt) {
      return {
        status: 400,
        errorMessage: 'Workout is already paused',
        data: null,
      };
    }

    await prisma.workoutLogEntry.deleteMany({ where: { logId } });

    await prisma.workoutLog.update({
      where: { id: logId },
      data: {
        status: 'PAUSED',
        pausedAt: new Date(),
        entries: {
          create: workoutData
            .sort((a: LoggedExercise, b: LoggedExercise) => a.order - b.order)
            .flatMap((exercise: LoggedExercise) =>
              exercise.completedSets.map(
                (set: CompletedSet, setIndex: number) => ({
                  exerciseId: exercise.exerciseId,
                  setNumber: setIndex + 1,
                  weight: set.weight,
                  reps: set.reps,
                  completed: set.completed,
                  completedSets: JSON.stringify(exercise.completedSets),
                }),
              ),
            ),
        },
      },
    });

    return { status: 200, errorMessage: 'Workout paused', data: log };
  } catch (error) {
    const errorResult = handleError(error);
    return { ...errorResult, data: null };
  }
}

export async function resumeWorkoutLog(
  logId: string,
): Promise<ApiResponse<WorkoutLog>> {
  const user = await getUser();
  if (!user)
    return { status: 401, errorMessage: 'Not authenticated', data: null };

  try {
    const log = await prisma.workoutLog.findUnique({
      where: { id: logId, userId: user.id },
    });

    if (!log?.pausedAt) {
      return {
        status: 400,
        errorMessage: 'No paused workout found',
        data: null,
      };
    }

    const now = new Date();
    const pausedDuration = Math.floor(
      (now.getTime() - new Date(log.pausedAt).getTime()) / 1000,
    );

    const updatedLog = await prisma.workoutLog.update({
      where: { id: logId },
      data: {
        status: 'IN_PROGRESS',
        pausedAt: null,
        totalPaused: log.totalPaused + pausedDuration,
      },
    });

    return { status: 200, errorMessage: 'Workout resumed', data: updatedLog };
  } catch (error) {
    const errorResult = handleError(error);
    return { ...errorResult, data: null };
  }
}

export async function getWorkoutLog(
  logId: string,
): Promise<ApiResponse<WorkoutLogWithEntries | null>> {
  const user = await getUser();
  if (!user) return { status: 401, errorMessage: 'Unauthorized', data: null };

  try {
    const baseLog = await prisma.workoutLog.findUnique({
      where: { id: logId, userId: user.id },
      select: { routineId: true },
    });

    if (!baseLog) {
      return { status: 404, errorMessage: 'Workout log not found', data: null };
    }

    const log = await prisma.workoutLog.findUnique({
      where: {
        id: logId,
        userId: user.id,
      },
      include: {
        entries: {
          include: {
            exercise: {
              include: {
                routines: {
                  where: {
                    routineId: baseLog.routineId,
                  },
                  select: {
                    order: true,
                    sets: true,
                    reps: true,
                    targetWeight: true,
                  },
                },
              },
            },
          },
          orderBy: { setNumber: 'asc' },
        },
      },
    });

    return { status: 200, errorMessage: 'Workout log fetched', data: log };
  } catch (error) {
    const errorResult = handleError(error);
    return { ...errorResult, data: null };
  }
}

export async function deleteWorkoutLog(
  logId: string,
): Promise<ApiResponse<null>> {
  const user = await getUser();
  if (!user) return { status: 401, errorMessage: 'Unauthorized', data: null };

  try {
    const log = await prisma.workoutLog.findUnique({
      where: { id: logId, userId: user.id },
    });

    if (!log)
      return { status: 404, errorMessage: 'Workout log not found', data: null };

    await prisma.workoutLog.delete({ where: { id: logId } });

    return {
      status: 200,
      errorMessage: 'Workout log deleted successfully',
      data: null,
    };
  } catch (error) {
    const errorResult = handleError(error);
    return { ...errorResult, data: null };
  }
}
