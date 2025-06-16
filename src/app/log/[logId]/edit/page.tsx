import { getUser } from '@/auth/server';
import getWorkoutLogById from '@/actions/getWorkoutById';
import { notFound } from 'next/navigation';
import WorkoutLogPage from '@/components/log/WorkoutLogPage';

export default async function EditWorkoutLogPage({
  params,
}: {
  params: { logId: string };
}) {
  const user = await getUser();
  const log = await getWorkoutLogById(params.logId);

  if (!log || log.userId !== user?.id) return notFound();

  return (
    <WorkoutLogPage
      routines={[log.routine]}
      restoredLog={{ ok: true, data: log }}
    />
  );
}
