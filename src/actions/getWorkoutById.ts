'use server';

import { prisma } from '@/db/prisma';

export default async function getWorkoutLogById(id: string) {
  return prisma.workoutLog.findUnique({
    where: { id },
    include: {
      routine: {
        include: {
          exercises: {
            include: {
              exercise: true,
            },
          },
        },
      },
      entries: {
        include: {
          exercise: {
            include: {
              routines: true,
            },
          },
        },
      },
    },
  });
}
