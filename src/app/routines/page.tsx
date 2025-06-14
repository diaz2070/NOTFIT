import { getUser } from '@/auth/server';
import RoutinesPage from '@/components/routines/RoutinesPage';

export default async function Page() {
  const dbUser = await getUser();

  if (!dbUser) return null;

  return <RoutinesPage userId={dbUser.id} />;
}
