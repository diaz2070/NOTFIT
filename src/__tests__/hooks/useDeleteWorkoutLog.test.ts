import { renderHook, act } from '@testing-library/react';
import useDeleteWorkoutLog from '@/hooks/useDeleteWorkoutLog';
import { toast } from 'sonner';

import deleteWorkoutLogAction from '@/actions/deleteWorkoutLog';

jest.mock('@/actions/deleteWorkoutLog', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useTransition: () => [false, (fn: () => void) => fn()],
}));

describe('useDeleteWorkoutLog', () => {
  const mockSuccess = jest.fn();
  const workoutId = 'workout-123';
  const userId = 'user-abc';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls deleteWorkoutLogAction and onSuccess on success', async () => {
    (deleteWorkoutLogAction as jest.Mock).mockResolvedValue({
      success: true,
      status: 200,
      errorMessage: null,
    });

    const { result } = renderHook(() => useDeleteWorkoutLog(mockSuccess));

    await act(async () => {
      result.current.deleteWorkoutLog(workoutId, userId);
    });

    expect(deleteWorkoutLogAction).toHaveBeenCalledWith(workoutId, userId);
    expect(toast.success).toHaveBeenCalledWith('Workout deleted successfully');
    expect(mockSuccess).toHaveBeenCalled();
  });

  it('calls toast.error on failure with custom message', async () => {
    (deleteWorkoutLogAction as jest.Mock).mockResolvedValue({
      success: false,
      status: 500,
      errorMessage: 'Failed to delete workout',
    });

    const { result } = renderHook(() => useDeleteWorkoutLog());

    await act(async () => {
      result.current.deleteWorkoutLog(workoutId, userId);
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to delete workout');
  });

  it('calls toast.error on failure with fallback message', async () => {
    (deleteWorkoutLogAction as jest.Mock).mockResolvedValue({
      success: false,
      status: 400,
      errorMessage: null,
    });

    const { result } = renderHook(() => useDeleteWorkoutLog());

    await act(async () => {
      result.current.deleteWorkoutLog(workoutId, userId);
    });

    expect(toast.error).toHaveBeenCalledWith('Could not delete workout');
  });

  it('exposes isPending as false by default', () => {
    const { result } = renderHook(() => useDeleteWorkoutLog());
    expect(result.current.isPending).toBe(false);
  });
});
