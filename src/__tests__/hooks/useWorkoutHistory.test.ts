import { renderHook, waitFor } from '@testing-library/react';
import useWorkoutHistory from '@/hooks/useWorkoutHistory';
import getWorkoutHistory from '@/actions/workoutHistory';

jest.mock('@/actions/workoutHistory', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useWorkoutHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads and sets workout history', async () => {
    const mockData = [
      {
        id: '1',
        routine: 'Cardio',
        date: '2024-01-01',
        duration: '30 min',
        exercises: [],
        notes: 'Test',
      },
    ];

    (getWorkoutHistory as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useWorkoutHistory());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('handles errors gracefully', async () => {
    const error = new Error('Fetch failed');
    (getWorkoutHistory as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useWorkoutHistory());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.data).toEqual([]);
  });
});
