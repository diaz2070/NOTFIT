import { renderHook } from '@testing-library/react';
import Cookies from 'js-cookie';
import useRoutineSelection from '@/hooks/useRoutineSelection';
import { startWorkoutLog } from '@/actions/workoutLog';
import type { RoutineWithExercises } from '@/types/routine';

jest.mock('js-cookie', () => ({
  set: jest.fn(),
}));

jest.mock('@/actions/workoutLog', () => ({
  startWorkoutLog: jest.fn(),
}));

const routineMock: RoutineWithExercises = {
  id: 'routine1',
  name: 'Full Body',
  userId: 'user1',
  daysOfWeek: ['Monday'],
  createdAt: new Date(),
  updatedAt: new Date(),
  description: null,
  exercises: [
    {
      id: 're1',
      routineId: 'routine1',
      exerciseId: 'ex1',
      order: 0,
      sets: 2,
      reps: 8,
      targetWeight: 50,
      restTime: null,
      note: null,
      exercise: {
        id: 'ex1',
        name: 'Bench Press',
        category: 'Chest',
        primaryMuscles: ['Pectorals'],
        secondaryMuscles: [],
        createdAt: new Date(),
        description: null,
        imageUrl: '',
        instructions: [],
      },
    },
  ],
};

describe('useRoutineSelection', () => {
  const setSelectedRoutine = jest.fn();
  const setLogId = jest.fn();
  const setWorkoutData = jest.fn();
  const setStartTime = jest.fn();

  const setup = () =>
    renderHook(() =>
      useRoutineSelection({
        routines: [routineMock],
        setSelectedRoutine,
        setLogId,
        setWorkoutData,
        setStartTime,
      }),
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does nothing if routine ID is not found', async () => {
    const { result } = setup();
    await result.current.handleRoutineSelect('non-existent-id');

    expect(setSelectedRoutine).toHaveBeenCalledWith('non-existent-id');
    expect(setStartTime).toHaveBeenCalled();
    expect(setLogId).not.toHaveBeenCalled();
    expect(Cookies.set).not.toHaveBeenCalled();
    expect(setWorkoutData).not.toHaveBeenCalled();
  });

  it('sets log ID and workout data correctly for valid routine', async () => {
    (startWorkoutLog as jest.Mock).mockResolvedValue({
      status: 200,
      errorMessage: '',
      data: { logId: 'log123' },
    });

    const { result } = setup();
    await result.current.handleRoutineSelect('routine1');

    expect(setSelectedRoutine).toHaveBeenCalledWith('routine1');
    expect(setStartTime).toHaveBeenCalled();
    expect(startWorkoutLog).toHaveBeenCalledWith('routine1');
    expect(setLogId).toHaveBeenCalledWith('log123');
    expect(Cookies.set).toHaveBeenCalledWith('activeWorkoutLogId', 'log123');

    expect(setWorkoutData).toHaveBeenCalledWith([
      {
        exerciseId: 'ex1',
        exerciseName: 'Bench Press',
        targetSets: 2,
        targetReps: 8,
        targetWeight: 50,
        order: 0,
        completedSets: [
          { reps: 8, weight: 50, completed: false },
          { reps: 8, weight: 50, completed: false },
        ],
      },
    ]);
  });
});
