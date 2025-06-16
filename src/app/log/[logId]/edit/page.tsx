import { getUser } from '@/auth/server';
import getWorkoutLogById from '@/actions/getWorkoutById';
import { notFound } from 'next/navigation';
import WorkoutLogPage from '@/components/log/WorkoutLogPage';
import { WorkoutLogWithEntries } from '@/types/routine';
import { ApiResponse } from '@/actions/workoutLog';

export default async function EditWorkoutLogPage({
  params,
}: Readonly<{
  params: Promise<{ logId: string }>;
}>) {
  const { logId } = await params;
  const user = await getUser();
  const log = await getWorkoutLogById(logId);

  if (!log || log.userId !== user?.id) return notFound();

  const apiResponse: ApiResponse<WorkoutLogWithEntries> = {
    status: 200,
    errorMessage: '',
    data: log,
  };

  return <WorkoutLogPage routines={[log.routine]} restoredLog={apiResponse} />;
}
