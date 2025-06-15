import useWorkoutLogController from '@/hooks/useWorkoutLogController';
import type { LoggedExercise } from '@/types/routine';
import { renderHook, act } from '@testing-library/react';

global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));

describe('useWorkoutLogController', () => {
  const initialData: LoggedExercise[] = [
    {
      exerciseId: 'ex1',
      exerciseName: 'Squat',
      targetSets: 2,
      targetReps: 10,
      targetWeight: 100,
      order: 0,
      completedSets: [
        { reps: 10, weight: 100, completed: false },
        { reps: 10, weight: 100, completed: true },
      ],
    },
  ];

  it('updates a set with valid numeric fields', () => {
    const setWorkoutData = jest.fn((updater) =>
      updater(JSON.parse(JSON.stringify(initialData))),
    );

    const { result } = renderHook(() =>
      useWorkoutLogController({
        setWorkoutData,
        workoutData: initialData,
      }),
    );

    act(() => {
      result.current.updateSet(0, 0, 'reps', 12);
    });

    expect(setWorkoutData).toHaveBeenCalledWith(expect.any(Function));
    const updated = setWorkoutData.mock.calls[0][0](
      JSON.parse(JSON.stringify(initialData)),
    );
    expect(updated[0].completedSets[0].reps).toBe(12);
  });

  it('prevents updating if value is NaN for reps or weight', () => {
    const setWorkoutData = jest.fn();

    const { result } = renderHook(() =>
      useWorkoutLogController({
        setWorkoutData,
        workoutData: initialData,
      }),
    );

    act(() => {
      result.current.updateSet(0, 0, 'weight', NaN);
    });

    expect(setWorkoutData).not.toHaveBeenCalled();
  });

  it('toggles the completed field correctly', () => {
    let dataCopy = JSON.parse(JSON.stringify(initialData));
    const setWorkoutData = jest.fn((updater) => {
      dataCopy = updater(dataCopy);
    });

    const { result } = renderHook(() =>
      useWorkoutLogController({
        setWorkoutData,
        workoutData: dataCopy,
      }),
    );

    act(() => {
      result.current.toggleSetComplete(0, 0);
    });

    expect(dataCopy[0].completedSets[0].completed).toBe(true);
  });

  it('returns correct number of completed sets for an exercise', () => {
    const { result } = renderHook(() =>
      useWorkoutLogController({
        setWorkoutData: jest.fn(),
        workoutData: initialData,
      }),
    );

    const completed = result.current.getCompletedSets(initialData[0]);
    expect(completed).toBe(1);
  });

  it('returns correct total completed sets and total sets', () => {
    const { result } = renderHook(() =>
      useWorkoutLogController({
        setWorkoutData: jest.fn(),
        workoutData: initialData,
      }),
    );

    expect(result.current.getTotalCompletedSets()).toBe(1);
    expect(result.current.getTotalSets()).toBe(2);
  });
});
