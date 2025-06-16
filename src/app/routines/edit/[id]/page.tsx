import { getRoutineById } from '@/actions/routines';
import EditRoutinePage from '@/components/Routine/EditRoutinePage';

export default async function Page({ params }: { params: { id: string } }) {
  const routine = await getRoutineById(params.id);

  if (!routine) {
    return <div className="p-4">Routine not found</div>;
  }

  return <EditRoutinePage routine={routine} />;
}
