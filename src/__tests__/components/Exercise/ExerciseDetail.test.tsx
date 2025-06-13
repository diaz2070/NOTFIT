import { render, screen, fireEvent } from '@testing-library/react';
import ExerciseDetail from '@/components/Exercise/ExerciseDetail';
import { ExerciseCategory, MuscleTarget } from '@prisma/client';

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

describe('<ExerciseDetail />', () => {
  it('renders fallback when no exercise is selected', () => {
    render(
      <ExerciseDetail
        exercise={null}
        onSelectConfirm={jest.fn()}
        selectedExercisesCount={0}
      />,
    );

    expect(
      screen.getByText(/Select an exercise to view details/i),
    ).toBeInTheDocument();
  });

  it('renders exercise details when exercise is passed', () => {
    render(
      <ExerciseDetail
        exercise={mockExercise}
        onSelectConfirm={jest.fn()}
        selectedExercisesCount={2}
      />,
    );

    expect(screen.getAllByText(/Push up/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/Great chest and core exercise/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Target Muscle/i)).toBeInTheDocument();
    expect(screen.getByText(/Secondary Muscles/i)).toBeInTheDocument();
    expect(screen.getByText(/Instrucciones/i)).toBeInTheDocument();
    expect(screen.getByText(/Select 2 exercise\(s\)/i)).toBeInTheDocument();
  });

  it('calls onSelectConfirm when button is clicked', () => {
    const onSelectConfirm = jest.fn();

    render(
      <ExerciseDetail
        exercise={mockExercise}
        onSelectConfirm={onSelectConfirm}
        selectedExercisesCount={1}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /select/i }));
    expect(onSelectConfirm).toHaveBeenCalledTimes(1);
  });
});
