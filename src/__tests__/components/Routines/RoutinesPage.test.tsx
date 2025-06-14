import { render, screen, fireEvent } from '@testing-library/react';
import RoutinesPage from '@/components/routines/RoutinesPage';
import { Routine, RoutineExercise, Exercise } from '@prisma/client';
import * as useRoutinesHook from '@/hooks/useRoutines';

jest.mock('@/hooks/useRoutines');

const mockRoutines: (Routine & {
  exercises: (RoutineExercise & { exercise: Exercise })[];
})[] = [
  {
    id: '1',
    name: 'Push Routine',
    description: '',
    daysOfWeek: ['Monday'],
    userId: 'u1',
    createdAt: new Date(),
    updatedAt: new Date(),
    exercises: [],
  },
  {
    id: '2',
    name: 'Leg Day',
    description: '',
    daysOfWeek: ['Friday'],
    userId: 'u1',
    createdAt: new Date(),
    updatedAt: new Date(),
    exercises: [],
  },
];

describe('<RoutinesPage />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state', () => {
    jest.spyOn(useRoutinesHook, 'default').mockReturnValue({
      routines: [],
      isPending: true,
    });
    render(<RoutinesPage userId="u1" />);
    expect(screen.getByText(/loading routines/i)).toBeInTheDocument();
  });

  it('shows empty message when no routines', () => {
    jest.spyOn(useRoutinesHook, 'default').mockReturnValue({
      routines: [],
      isPending: false,
    });
    render(<RoutinesPage userId="u1" />);
    expect(screen.getByText(/you have no routines yet/i)).toBeInTheDocument();
  });

  it('filters by search input', () => {
    jest.spyOn(useRoutinesHook, 'default').mockReturnValue({
      routines: mockRoutines,
      isPending: false,
    });
    render(<RoutinesPage userId="u1" />);
    fireEvent.change(screen.getByPlaceholderText(/search by name/i), {
      target: { value: 'Leg' },
    });
    expect(screen.getByText(/Leg Day/)).toBeInTheDocument();
    expect(screen.queryByText(/Push Routine/)).not.toBeInTheDocument();
  });

  it('changes sort order', () => {
    jest.spyOn(useRoutinesHook, 'default').mockReturnValue({
      routines: mockRoutines.map((r) => ({
        ...r,
        exercises: [
          {
            id: 'e1',
            routineId: r.id,
            exerciseId: 'x',
            exercise: {} as Exercise,
          },
        ],
      })),
      isPending: false,
    });
    render(<RoutinesPage userId="u1" />);
    fireEvent.change(screen.getByRole('combobox', { name: /sort by/i }), {
      target: { value: 'exercises' },
    });
    expect(screen.getByText(/Push Routine/)).toBeInTheDocument();
    expect(screen.getByText(/Leg Day/)).toBeInTheDocument();
  });
});
