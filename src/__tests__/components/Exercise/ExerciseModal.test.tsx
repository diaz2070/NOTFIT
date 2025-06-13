import { render, screen, fireEvent } from '@testing-library/react';
import ExerciseModal from '@/components/Exercise/ExerciseModal';
import '@testing-library/jest-dom';
import { ExerciseCategory, MuscleTarget } from '@prisma/client';
import React from 'react';

jest.mock('@/hooks/useFilteredExercises', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseFilteredExercises = jest.requireMock(
  '@/hooks/useFilteredExercises',
).default;

const mockExercise = {
  id: '1',
  name: 'push up',
  category: ExerciseCategory.Chest,
  primaryMuscles: [MuscleTarget.Pectorals],
  secondaryMuscles: ['abs'],
  description: 'Great chest and core exercise',
  instructions: ['Get on the floor', 'Push up and down'],
  imageUrl: '',
  createdAt: new Date(),
};

describe('ExerciseModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens the modal and renders the title', () => {
    mockUseFilteredExercises.mockReturnValue({
      exercises: [],
      filters: {
        page: 1,
        search: '',
        category: 'all',
        muscle: 'all',
        sort: '',
      },
      updateFilter: jest.fn(),
      clearFilters: jest.fn(),
      isPending: false,
      totalPages: 1,
      nextPage: jest.fn(),
      prevPage: jest.fn(),
    });

    render(
      <ExerciseModal>
        <button type="button">Open Modal</button>
      </ExerciseModal>,
    );
    expect(screen.queryByText('Explore exercises')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Open Modal'));
    expect(screen.getByText('Explore exercises')).toBeInTheDocument();
    expect(
      screen.getByText('Browse and select exercises for your workout routine'),
    ).toBeInTheDocument();
  });

  it('shows loader when loading', () => {
    mockUseFilteredExercises.mockReturnValue({
      exercises: [],
      filters: {
        page: 1,
        search: '',
        category: 'all',
        muscle: 'all',
        sort: '',
      },
      updateFilter: jest.fn(),
      clearFilters: jest.fn(),
      isPending: true,
      totalPages: 1,
      nextPage: jest.fn(),
      prevPage: jest.fn(),
    });

    render(
      <ExerciseModal>
        <button type="button">Open Modal</button>
      </ExerciseModal>,
    );

    fireEvent.click(screen.getByText('Open Modal'));

    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByText('Loading exercises...')).toBeInTheDocument();
  });

  it('toggles exercise selection correctly', () => {
    mockUseFilteredExercises.mockReturnValue({
      exercises: [mockExercise],
      filters: {
        page: 1,
        search: '',
        category: 'all',
        muscle: 'all',
        sort: '',
      },
      updateFilter: jest.fn(),
      clearFilters: jest.fn(),
      isPending: false,
      totalPages: 1,
      nextPage: jest.fn(),
      prevPage: jest.fn(),
    });

    render(
      <ExerciseModal>
        <button type="button">Open Modal</button>
      </ExerciseModal>,
    );

    fireEvent.click(screen.getByText('Open Modal'));
    const exerciseItem = screen.getByText(/push up/i);
    fireEvent.click(exerciseItem);
    fireEvent.click(exerciseItem);
  });

  it('clears filters and selection when modal is closed', () => {
    const clearFiltersMock = jest.fn();

    mockUseFilteredExercises.mockReturnValue({
      exercises: [],
      filters: {
        page: 1,
        search: '',
        category: 'all',
        muscle: 'all',
        sort: '',
      },
      updateFilter: jest.fn(),
      clearFilters: clearFiltersMock,
      isPending: false,
      totalPages: 1,
      nextPage: jest.fn(),
      prevPage: jest.fn(),
    });

    render(
      <ExerciseModal>
        <button type="button">Open Modal</button>
      </ExerciseModal>,
    );
    fireEvent.click(screen.getByText('Open Modal'));
  });
  it('calls onExerciseSelect and closes modal when selection is confirmed', () => {
    const onExerciseSelectMock = jest.fn();

    mockUseFilteredExercises.mockReturnValue({
      exercises: [mockExercise],
      filters: {
        page: 1,
        search: '',
        category: 'all',
        muscle: 'all',
        sort: '',
      },
      updateFilter: jest.fn(),
      clearFilters: jest.fn(),
      isPending: false,
      totalPages: 1,
      nextPage: jest.fn(),
      prevPage: jest.fn(),
    });

    render(
      <ExerciseModal onExerciseSelect={onExerciseSelectMock}>
        <button type="button">Open Modal</button>
      </ExerciseModal>,
    );

    fireEvent.click(screen.getByText('Open Modal'));

    fireEvent.click(screen.getByText(/push up/i));

    fireEvent.click(screen.getByRole('button', { name: /select/i }));

    expect(onExerciseSelectMock).toHaveBeenCalledWith(mockExercise);

    expect(screen.queryByText('Explore exercises')).not.toBeInTheDocument();
  });
});
