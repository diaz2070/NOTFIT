import { renderHook, act } from '@testing-library/react';
import useWorkoutLogState from '@/hooks/useWorkoutLogState';
import type { LoggedExercise } from '@/types/routine';

describe('useWorkoutLogState', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useWorkoutLogState());

    expect(result.current.workoutStatus).toBe('IN_PROGRESS');
    expect(result.current.pausedAt).toBeNull();
    expect(result.current.logId).toBeNull();
    expect(result.current.selectedRoutine).toBe('');
    expect(result.current.generalNotes).toBe('');
    expect(result.current.workoutData).toEqual([]);
    expect(result.current.startTime).toBeInstanceOf(Date);
  });

  it('updates state values correctly', () => {
    const { result } = renderHook(() => useWorkoutLogState());

    act(() => {
      result.current.setWorkoutStatus('PAUSED');
      result.current.setPausedAt(new Date('2024-01-01T00:00:00Z'));
      result.current.setLogId('log123');
      result.current.setSelectedRoutine('routine456');
      result.current.setStartTime(new Date('2025-01-01T12:00:00Z'));
      result.current.setGeneralNotes('Workout notes');
      result.current.setWorkoutData([
        {
          exerciseId: '1',
          exerciseName: 'Push-up',
          targetSets: 3,
          targetReps: 10,
          targetWeight: 0,
          completedSets: [],
          order: 0,
        },
      ]);
    });

    expect(result.current.workoutStatus).toBe('PAUSED');
    expect(result.current.pausedAt?.toISOString()).toBe(
      '2024-01-01T00:00:00.000Z',
    );
    expect(result.current.logId).toBe('log123');
    expect(result.current.selectedRoutine).toBe('routine456');
    expect(result.current.startTime.toISOString()).toBe(
      '2025-01-01T12:00:00.000Z',
    );
    expect(result.current.generalNotes).toBe('Workout notes');
    expect(result.current.workoutData).toHaveLength(1);
    expect(result.current.workoutData[0].exerciseName).toBe('Push-up');
  });

  it('resets state to default values', () => {
    const { result } = renderHook(() => useWorkoutLogState());

    act(() => {
      result.current.setWorkoutStatus('PAUSED');
      result.current.setLogId('log999');
      result.current.setGeneralNotes('something');
      result.current.resetLogState();
    });

    expect(result.current.workoutStatus).toBe('IN_PROGRESS');
    expect(result.current.logId).toBeNull();
    expect(result.current.generalNotes).toBe('');
    expect(result.current.selectedRoutine).toBe('');
    expect(result.current.pausedAt).toBeNull();
    expect(result.current.workoutData).toEqual([]);
  });
});
