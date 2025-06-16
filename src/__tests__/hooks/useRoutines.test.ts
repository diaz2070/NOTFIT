import { renderHook, act } from '@testing-library/react';
import useRoutines from '@/hooks/useRoutines';
import { getRoutinesAction, RoutineWithExercises } from '@/actions/routines';
import { toast } from 'sonner';

jest.mock('@/actions/routines', () => ({
  __esModule: true,
  getRoutinesAction: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockRoutine: RoutineWithExercises = {
  id: 'r1',
  name: 'Routine A',
  description: 'desc',
  userId: 'u1',
  daysOfWeek: ['Monday'],
  createdAt: new Date(),
  updatedAt: new Date(),
  exercises: [],
};

describe('useRoutines', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not fetch if open is false', async () => {
    const { result } = renderHook(() => useRoutines('u1', false));
    expect(result.current.routines).toEqual([]);
    expect(getRoutinesAction).not.toHaveBeenCalled();
  });

  it('does not fetch if userId is undefined', async () => {
    const { result } = renderHook(() => useRoutines(undefined, true));
    expect(result.current.routines).toEqual([]);
    expect(getRoutinesAction).not.toHaveBeenCalled();
  });

  it('fetches routines when userId and open are valid', async () => {
    (getRoutinesAction as jest.Mock).mockResolvedValue({
      status: 200,
      data: [mockRoutine],
    });

    const { result } = renderHook(() => useRoutines('u1', true));
    await act(async () => {});

    expect(getRoutinesAction).toHaveBeenCalledWith('u1');
    expect(result.current.routines).toEqual([mockRoutine]);
  });

  it('calls toast on error response', async () => {
    (getRoutinesAction as jest.Mock).mockResolvedValue({
      status: 500,
      data: null,
      errorMessage: 'Server exploded',
    });

    renderHook(() => useRoutines('u1', true));
    await act(async () => {});

    expect(toast.error).toHaveBeenCalledWith('Error al cargar rutinas', {
      description: 'Server exploded',
      duration: 6000,
    });
  });
});
