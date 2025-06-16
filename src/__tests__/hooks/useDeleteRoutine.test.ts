import { renderHook, act } from '@testing-library/react';
import useDeleteRoutine from '@/hooks/useDeleteRoutine';
import * as deleteRoutineActionModule from '@/actions/deleteRoutine';
import { toast } from 'sonner';

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/actions/deleteRoutine');

describe('useDeleteRoutine', () => {
  const mockDeleteRoutineAction =
    deleteRoutineActionModule.default as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls deleteRoutineAction and shows success toast', async () => {
    mockDeleteRoutineAction.mockResolvedValue({ success: true });

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useDeleteRoutine(onSuccess));

    await act(async () => {
      result.current.deleteRoutine('routine123', 'user123');
    });

    expect(mockDeleteRoutineAction).toHaveBeenCalledWith(
      'routine123',
      'user123',
    );
    expect(toast.success).toHaveBeenCalledWith('Routine deleted successfully');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('shows error toast if deletion fails', async () => {
    mockDeleteRoutineAction.mockResolvedValue({
      success: false,
      errorMessage: 'Deletion failed',
    });

    const { result } = renderHook(() => useDeleteRoutine());

    await act(async () => {
      result.current.deleteRoutine('routine123', 'user123');
    });

    expect(toast.error).toHaveBeenCalledWith('Deletion failed');
  });

  it('shows generic error toast if no errorMessage is provided', async () => {
    mockDeleteRoutineAction.mockResolvedValue({ success: false });

    const { result } = renderHook(() => useDeleteRoutine());

    await act(async () => {
      result.current.deleteRoutine('routine123', 'user123');
    });

    expect(toast.error).toHaveBeenCalledWith('Could not delete routine');
  });

  it('does not throw if onSuccess is undefined', async () => {
    mockDeleteRoutineAction.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useDeleteRoutine());

    await act(async () => {
      result.current.deleteRoutine('routine123', 'user123');
    });

    expect(toast.success).toHaveBeenCalledWith('Routine deleted successfully');
  });
});
