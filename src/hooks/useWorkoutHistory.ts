import { useEffect, useState } from 'react';
import getWorkoutHistory from '@/actions/workoutHistory';
import { Workout } from '@/types/workout';

export default function useWorkoutHistory() {
  const [data, setData] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getWorkoutHistory();
        setData(res);
      } catch (e) {
        if (e instanceof Error) setError(e);
        else setError(new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { data, loading, error };
}
