import { render, screen, fireEvent } from '@testing-library/react';
import RoutinesPage from '@/components/routines/RoutinesPage';
import * as useRoutinesHook from '@/hooks/useRoutines';
import { Routine, RoutineExercise, Exercise } from '@prisma/client';

jest.mock('@/hooks/useRoutines');
jest.mock('@/hooks/useDeleteRoutine');

const mockRoutines: (Routine & {
  exercises: (RoutineExercise & { exercise: Exercise })[];
})[] = [
  {
    id: 'r1',
    name: 'Leg Day',
    daysOfWeek: ['Monday'],
    description: '',
    userId: 'u1',
    createdAt: new Date(),
    updatedAt: new Date(),
    exercises: [],
  },
];

jest.mock('@/hooks/useDeleteRoutine', () => ({
  __esModule: true,
  default: () => ({
    deleteRoutine: jest.fn(),
  }),
}));

describe('<RoutinesPage />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    jest.spyOn(useRoutinesHook, 'default').mockReturnValue({
      routines: [],
      isPending: true,
      setRoutines: jest.fn(),
    });
    render(<RoutinesPage userId="u1" />);
    expect(screen.getByText(/loading routines/i)).toBeInTheDocument();
  });

  it('shows empty state when no routines exist', () => {
    jest.spyOn(useRoutinesHook, 'default').mockReturnValue({
      routines: [],
      isPending: false,
      setRoutines: jest.fn(),
    });
    render(<RoutinesPage userId="u1" />);
    expect(
      screen.getByText((c) =>
        c.toLowerCase().includes("you don't have any routines yet"),
      ),
    ).toBeInTheDocument();
  });

  it('renders a list of routines', () => {
    jest.spyOn(useRoutinesHook, 'default').mockReturnValue({
      routines: mockRoutines,
      isPending: false,
      setRoutines: jest.fn(),
    });
    render(<RoutinesPage userId="u1" />);
    expect(screen.getByText('Leg Day')).toBeInTheDocument();
  });

  it('filters routines by name', () => {
    jest.spyOn(useRoutinesHook, 'default').mockReturnValue({
      routines: mockRoutines,
      isPending: false,
      setRoutines: jest.fn(),
    });
    render(<RoutinesPage userId="u1" />);
    fireEvent.change(screen.getByPlaceholderText(/search by name/i), {
      target: { value: 'Push' },
    });
    expect(screen.queryByText('Leg Day')).not.toBeInTheDocument();
  });
});
