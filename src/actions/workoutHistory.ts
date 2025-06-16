// src/actions/getWorkoutHistory.ts

'use server';

import { prisma } from '@/db/prisma';
import { getUser } from '@/auth/server';

// Después
async function getWorkoutHistory() {
  const user = await getUser();
  if (!user) return [];

  const logs = await prisma.workoutLog.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
    include: {
      routine: true,
      entries: { include: { exercise: true } },
    },
  });

  return logs.map((log) => ({
    id: log.id,
    date: log.date,
    routine: log.routine.name,
    duration:
      log.startTime && log.endTime
        ? `${Math.round((log.endTime.getTime() - log.startTime.getTime()) / 60000)} min`
        : undefined,
    exercises: log.entries.map((entry) => ({
      name: entry.exercise.name,
      reps: entry.reps,
      sets: `${entry.setNumber}`,
      weight: `${entry.weight}lbs`,
    })),
    notes: log.comment,
  }));
}

export default getWorkoutHistory;
