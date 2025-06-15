import { renderHook, act } from '@testing-library/react';
import useFilteredExercises from '@/hooks/useFilteredExercises';
import { Exercise } from '@prisma/client';

import getExercisesAction from '@/actions/exercises';
import { toast } from 'sonner';

jest.mock('@/actions/exercises', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockExercise: Exercise = {
  id: '1',
  name: 'Bench Press',
  category: 'Chest',
  primaryMuscles: ['Pectorals'],
  secondaryMuscles: [],
  description: 'Chest exercise',
  instructions: ['Lie on bench', 'Push the bar'],
  imageUrl: '/bench.png',
  createdAt: new Date(),
};

describe('useFilteredExercises', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and sets exercises when open is true', async () => {
    (getExercisesAction as jest.Mock).mockResolvedValue({
      status: 200,
      data: { items: [mockExercise], total: 1 },
    });

    const { result } = renderHook(() => useFilteredExercises(true));

    await act(async () => {});

    expect(getExercisesAction).toHaveBeenCalled();
    expect(result.current.exercises).toEqual([mockExercise]);
    expect(result.current.totalPages).toBe(1);
  });

  it('handles 404 response with empty result', async () => {
    (getExercisesAction as jest.Mock).mockResolvedValue({
      status: 404,
      data: null,
      errorMessage: 'No exercises found',
    });

    const { result } = renderHook(() => useFilteredExercises(true));
    await act(async () => {});

    expect(result.current.exercises).toEqual([]);
    expect(result.current.totalPages).toBe(1);
  });

  it('calls toast on fetch error', async () => {
    (getExercisesAction as jest.Mock).mockResolvedValue({
      status: 500,
      data: null,
      errorMessage: 'Server error',
    });

    renderHook(() => useFilteredExercises(true));
    await act(async () => {});

    expect(toast.error).toHaveBeenCalledWith('Failed to fetch exercises', {
      description: 'Server error',
      duration: 6000,
    });
  });

  it('updates filters with updateFilter()', () => {
    const { result } = renderHook(() => useFilteredExercises(false));

    act(() => {
      result.current.updateFilter('search', 'biceps');
    });

    expect(result.current.filters.search).toBe('biceps');
    expect(result.current.filters.page).toBe(1);
  });

  it('increments and decrements page correctly', () => {
    const { result } = renderHook(() => useFilteredExercises(false));

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.filters.page).toBe(2);

    act(() => {
      result.current.prevPage();
    });

    expect(result.current.filters.page).toBe(1);
  });

  it('resets filters with clearFilters()', () => {
    const { result } = renderHook(() => useFilteredExercises(false));

    act(() => {
      result.current.updateFilter('search', 'abc');
      result.current.clearFilters();
    });

    expect(result.current.filters.search).toBe('');
    expect(result.current.filters.category).toBe('all');
  });
});
