'use server';

import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';

const editWorkoutLog = async (
  logId: string,
  {
    notes,
    entries,
  }: {
    notes: string;
    entries: { id: string; reps: number; weight: number; completed: boolean }[];
  },
) => {
  await Promise.all(
    entries.map((entry) =>
      prisma.workoutLogEntry.update({
        where: { id: entry.id },
        data: {
          reps: entry.reps,
          weight: entry.weight,
          completed: entry.completed,
        },
      }),
    ),
  );

  await prisma.workoutLog.update({
    where: { id: logId },
    data: { comment: notes },
  });

  revalidatePath('/history');
};

export default editWorkoutLog;
