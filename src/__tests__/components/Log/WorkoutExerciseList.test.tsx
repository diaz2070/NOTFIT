import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkoutExerciseList from '@/components/log/WorkoutExerciseList';
import type { LoggedExercise } from '@/types/routine';

jest.mock('@/components/log/InputNumeric', () => ({
  __esModule: true,
  default: ({
    value,
    onValidChange,
  }: {
    value: number;
    onValidChange: (val: number) => void;
  }) => (
    <input
      data-testid="numeric-input"
      defaultValue={value}
      onChange={(e) => onValidChange(Number(e.target.value))}
    />
  ),
}));

describe('WorkoutExerciseList', () => {
  const mockToggle = jest.fn();
  const mockUpdate = jest.fn();
  const mockGetCompleted = jest.fn();

  const exercises: LoggedExercise[] = [
    {
      exerciseId: '1',
      exerciseName: 'bench press',
      targetSets: 2,
      targetReps: 10,
      targetWeight: 100,
      order: 1,
      completedSets: [
        { reps: 10, weight: 100, completed: false },
        { reps: 10, weight: 100, completed: true },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCompleted.mockReturnValue(1);
  });

  it('renders exercise name, badge and sets', () => {
    render(
      <WorkoutExerciseList
        exercises={exercises}
        toggleSetComplete={mockToggle}
        updateSet={mockUpdate}
        getCompletedSets={mockGetCompleted}
      />,
    );

    expect(screen.getByText('Bench press')).toBeInTheDocument();
    expect(screen.getByText('1/2 series')).toBeInTheDocument();
    expect(
      screen.getByText('Goal: 2 sets × 10 reps @ 100lbs'),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('numeric-input')).toHaveLength(4);
  });

  it('calls toggleSetComplete when check button is clicked', async () => {
    render(
      <WorkoutExerciseList
        exercises={exercises}
        toggleSetComplete={mockToggle}
        updateSet={mockUpdate}
        getCompletedSets={mockGetCompleted}
      />,
    );

    const toggleButtons = screen.getAllByRole('button');
    await userEvent.click(toggleButtons[0]);

    expect(mockToggle).toHaveBeenCalledWith(0, 0);
  });

  it('calls updateSet when reps or weight is changed', async () => {
    render(
      <WorkoutExerciseList
        exercises={exercises}
        toggleSetComplete={mockToggle}
        updateSet={mockUpdate}
        getCompletedSets={mockGetCompleted}
      />,
    );

    const inputs = screen.getAllByTestId('numeric-input');
    await userEvent.clear(inputs[0]);
    await userEvent.type(inputs[0], '12');

    expect(mockUpdate).toHaveBeenCalledWith(0, 0, 'reps', 12);
  });
});
