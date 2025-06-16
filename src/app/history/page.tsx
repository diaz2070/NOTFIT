import { getUser } from '@/auth/server';
import HistoryPage from '@/components/history/WorkoutHistory';

export const metadata = {
  title: 'Workout History',
  description: 'Check your workout history',
};

export default async function HistoryRoutePage() {
  const dbUser = await getUser();

  if (!dbUser) return null;

  return <HistoryPage userId={dbUser.id} />;
}
