import { getUser } from '@/auth/server';
import { prisma } from '@/db/prisma';
import { cookies } from 'next/headers';

import WorkoutLogPage from '@/components/log/WorkoutLogPage';
import { getWorkoutLog } from '@/actions/workoutLog';

export default async function Log() {
  const user = await getUser();
  const userId = user?.id;

  const cookieStore = await cookies();
  const savedLogId = cookieStore.get('activeWorkoutLogId')?.value;

  let restoredLog = null;
  if (savedLogId) {
    restoredLog = await getWorkoutLog(savedLogId);
  }

  const routines = await prisma.routine.findMany({
    where: { userId },
    include: {
      exercises: {
        include: {
          exercise: true,
        },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <WorkoutLogPage routines={routines} restoredLog={restoredLog} />
    </div>
  );
}
