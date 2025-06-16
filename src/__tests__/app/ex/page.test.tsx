import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Exercise, ExerciseCategory, MuscleTarget } from '@prisma/client';
import Ex from '@/app/ex/page';

type ModalProps = {
  children: React.ReactNode;
  onExerciseSelect: (exercise: Exercise) => void;
};

jest.mock('@/components/Exercise/ExerciseModal', () => ({
  __esModule: true,
  default: ({ children, onExerciseSelect }: ModalProps) => (
    <div>
      <button
        type="button"
        onClick={() =>
          onExerciseSelect({
            id: '1',
            name: 'Push Up',
            category: ExerciseCategory.Chest,
            primaryMuscles: [MuscleTarget.Pectorals],
            secondaryMuscles: [],
            description: 'Chest exercise',
            instructions: ['Do pushups'],
            imageUrl: '',
            createdAt: new Date(),
          })
        }
      >
        TriggerSelect
      </button>
      {children}
    </div>
  ),
}));

describe('<Ex />', () => {
  it('renders with no exercises selected', () => {
    render(<Ex />);
    expect(screen.getByText(/None selected/i)).toBeInTheDocument();
  });

  it('adds an exercise when selected from modal', async () => {
    render(<Ex />);
    const triggerButton = screen.getByText('TriggerSelect');
    await userEvent.click(triggerButton);

    expect(screen.getByText(/Push Up/)).toBeInTheDocument();
  });

  it('does not add the same exercise twice', async () => {
    render(<Ex />);
    const triggerButton = screen.getByText('TriggerSelect');
    await userEvent.click(triggerButton);
    await userEvent.click(triggerButton);

    const names = screen.getByText(/Push Up/);
    expect(names).toBeInTheDocument();
  });
});
