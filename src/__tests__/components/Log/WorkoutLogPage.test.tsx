import { render, screen } from '@testing-library/react';
import WorkoutLogPage from '@/components/log/WorkoutLogPage';
import type { RoutineWithExercises } from '@/types/routine';
import useWorkoutLog from '@/hooks/useWorkoutLog';

jest.mock('@/hooks/useWorkoutLog');

jest.mock('@/actions/editWorkoutLog', () => ({
  editWorkoutLog: jest.fn(),
}));

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock('@/components/log/WorkoutProgressBar', () => {
  return function MockProgressBar() {
    return <div>ProgressBar</div>;
  };
});
jest.mock('@/components/log/WorkoutExerciseList', () => {
  return function MockExerciseList() {
    return <div>ExerciseList</div>;
  };
});
jest.mock('@/components/log/WorkoutNotesCard', () => {
  return function MockNotesCard() {
    return <div>NotesCard</div>;
  };
});
jest.mock('@/components/log/WorkoutActionButtons', () => {
  return function MockActionButtons() {
    return <div>ActionButtons</div>;
  };
});
jest.mock('@/components/log/SelectRoutine', () => {
  return function MockSelectRoutine() {
    return <div>SelectRoutine</div>;
  };
});
jest.mock('@/components/log/PausedWarningCard', () => {
  return function MockPausedWarning() {
    return <div>PausedWarning</div>;
  };
});

describe('WorkoutLogPage', () => {
  const routines: RoutineWithExercises[] = [
    {
      id: 'routine-1',
      name: 'Full Body',
      description: 'A full body routine',
      daysOfWeek: ['Monday', 'Wednesday'],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user-1',
      exercises: [],
    },
  ];

  it('renders SelectRoutine if no routine selected', () => {
    (useWorkoutLog as jest.Mock).mockReturnValue({
      workoutState: {
        selectedRoutine: '',
      },
      controller: {},
      handlers: {},
      availableRoutines: routines,
      handleRoutineSelect: jest.fn(),
      isBusy: false,
    });

    render(<WorkoutLogPage routines={routines} />);

    expect(screen.getByText('SelectRoutine')).toBeInTheDocument();
  });

  it('renders full workout form if routine is selected', () => {
    (useWorkoutLog as jest.Mock).mockReturnValue({
      workoutState: {
        selectedRoutine: 'routine-1',
        workoutStatus: 'IN_PROGRESS',
        pausedAt: null,
        startTime: new Date(),
        workoutData: [],
        generalNotes: '',
        isSaving: false,
        isDeleting: false,
        isDiscardingRoutine: false,
        isPausing: false,
        isResuming: false,
      },
      controller: {
        getCompletedSets: jest.fn(),
        getTotalCompletedSets: jest.fn(() => 2),
        getTotalSets: jest.fn(() => 4),
        updateSet: jest.fn(),
        toggleSetComplete: jest.fn(),
        setGeneralNotes: jest.fn(),
      },
      handlers: {
        handleSubmitLog: jest.fn((e) => e.preventDefault?.()),
        handleChangeRoutine: jest.fn(),
        handlePauseWorkout: jest.fn(),
        handleResumeWorkout: jest.fn(),
        handleDiscard: jest.fn(),
      },
      availableRoutines: routines,
      handleRoutineSelect: jest.fn(),
      isBusy: false,
    });

    render(<WorkoutLogPage routines={routines} />);

    expect(screen.getByText('ProgressBar')).toBeInTheDocument();
    expect(screen.getByText('ExerciseList')).toBeInTheDocument();
    expect(screen.getByText('NotesCard')).toBeInTheDocument();
    expect(screen.getByText('ActionButtons')).toBeInTheDocument();
    expect(screen.getByText('PausedWarning')).toBeInTheDocument();
  });

  it('navigates to /routines on Back button when not in edit mode', () => {
    (useWorkoutLog as jest.Mock).mockReturnValue({
      workoutState: {
        selectedRoutine: '',
      },
      controller: {},
      handlers: {},
      availableRoutines: routines,
      handleRoutineSelect: jest.fn(),
      isBusy: false,
    });

    render(<WorkoutLogPage routines={routines} />);
    screen.getByText(/Back to Routines/i).click();

    expect(mockPush).toHaveBeenCalledWith('/routines');
  });
});
