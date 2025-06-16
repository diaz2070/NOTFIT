import RoutinesPage from '@/components/routines/RoutinesPage';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { Routine, RoutineExercise, Exercise, DayOfWeek } from '@prisma/client';
import * as useRoutinesHook from '@/hooks/useRoutines';

jest.mock('@/hooks/useRoutines');
jest.mock('@/hooks/useDeleteRoutine', () => ({
  __esModule: true,
  default: () => ({
    deleteRoutine: jest.fn(),
    isDeleting: false,
  }),
}));

const mockRoutines: (Routine & {
  exercises: (RoutineExercise & { exercise: Exercise })[];
})[] = [
  {
    id: '1',
    name: 'Push Routine',
    description: '',
    daysOfWeek: [DayOfWeek.Monday],
    userId: 'u1',
    createdAt: new Date(),
    updatedAt: new Date(),
    exercises: [],
  },
  {
    id: '2',
    name: 'Leg Day',
    description: '',
    daysOfWeek: [DayOfWeek.Friday],
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
      setRoutines: jest.fn(),
    });
    render(<RoutinesPage userId="u1" />);
    expect(screen.getByText(/loading routines.../i)).toBeInTheDocument();
  });

  it('shows empty message when no routines', () => {
    jest.spyOn(useRoutinesHook, 'default').mockReturnValue({
      routines: [],
      isPending: false,
      setRoutines: jest.fn(),
    });
    render(<RoutinesPage userId="u1" />);
    expect(
      screen.getByText(/You don't have any routines yet/i),
    ).toBeInTheDocument();
  });

  it('filters by search input', () => {
    jest.spyOn(useRoutinesHook, 'default').mockReturnValue({
      routines: mockRoutines,
      isPending: false,
      setRoutines: jest.fn(),
    });
    render(<RoutinesPage userId="u1" />);
    fireEvent.change(screen.getByPlaceholderText(/search by name/i), {
      target: { value: 'Leg' },
    });
    expect(screen.getByText(/Leg Day/)).toBeInTheDocument();
    expect(screen.queryByText(/Push Routine/)).not.toBeInTheDocument();
  });

  it('filters by day', async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    jest.spyOn(useRoutinesHook, 'default').mockReturnValue({
      routines: mockRoutines,
      isPending: false,
      setRoutines: jest.fn(),
    });

    render(<RoutinesPage userId="u1" />);

    fireEvent.click(screen.getByRole('combobox', { name: /day of the week/i }));
    const dropdown = await screen.findByRole('listbox');
    fireEvent.click(within(dropdown).getByText('Monday'));

    await waitFor(() => {
      expect(screen.getByText(/Push Routine/)).toBeInTheDocument();
      expect(screen.queryByText(/Leg Day/)).not.toBeInTheDocument();
    });
  });

  it('renders pagination when routines exceed page limit', () => {
    const manyRoutines = Array.from({ length: 8 }, (_, i) => ({
      id: `${i}`,
      name: `Routine ${i}`,
      description: '',
      daysOfWeek: [DayOfWeek.Monday],
      userId: 'u1',
      createdAt: new Date(),
      updatedAt: new Date(),
      exercises: [],
    }));

    jest.spyOn(useRoutinesHook, 'default').mockReturnValue({
      routines: manyRoutines,
      isPending: false,
      setRoutines: jest.fn(),
    });

    render(<RoutinesPage userId="u1" />);
    expect(screen.getByText(/Routine 0/)).toBeInTheDocument();
    expect(screen.queryByText(/Routine 7/)).not.toBeInTheDocument();
  });

  it('navigates to next and previous pages', () => {
    const manyRoutines = Array.from({ length: 12 }, (_, i) => ({
      id: `${i}`,
      name: `Routine ${i}`,
      description: '',
      daysOfWeek: [DayOfWeek.Monday],
      userId: 'u1',
      createdAt: new Date(),
      updatedAt: new Date(),
      exercises: [],
    }));

    jest.spyOn(useRoutinesHook, 'default').mockReturnValue({
      routines: manyRoutines,
      isPending: false,
      setRoutines: jest.fn(),
    });

    render(<RoutinesPage userId="u1" />);

    const nextButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextButton);

    const prevButton = screen.getByRole('button', { name: /previous page/i });
    fireEvent.click(prevButton);
  });

  it('closes delete modal on cancel', () => {
    jest.spyOn(useRoutinesHook, 'default').mockReturnValue({
      routines: mockRoutines,
      isPending: false,
      setRoutines: jest.fn(),
    });

    render(<RoutinesPage userId="u1" />);
    fireEvent.click(screen.getAllByRole('button', { name: '' })[1]);

    const cancelBtn = screen.getByText('Cancel');
    fireEvent.click(cancelBtn);

    expect(screen.queryByText(/Delete Routine/)).not.toBeInTheDocument();
  });

  it('sorts routines by number of exercises', async () => {
    const routines = [
      { ...mockRoutines[0], exercises: Array(3).fill({}) },
      { ...mockRoutines[1], exercises: [] },
    ];
    jest.spyOn(useRoutinesHook, 'default').mockReturnValue({
      routines,
      isPending: false,
      setRoutines: jest.fn(),
    });

    render(<RoutinesPage userId="u1" />);
    fireEvent.click(screen.getByRole('combobox', { name: /sort by/i }));
    const dropdown = await screen.findByRole('listbox');
    fireEvent.click(within(dropdown).getByText('Number of exercises'));

    const matches = screen.getAllByText(
      (_, node) => node?.textContent?.trim() === '3 exercises',
    );
    expect(matches.length).toBeGreaterThan(0);
  });
});
