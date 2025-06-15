import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HistoryPage from '@/components/history/WorkoutHistory';
import getWorkoutHistory from '@/actions/workoutHistory';

jest.mock('@/actions/workoutHistory', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('WorkoutHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', async () => {
    (getWorkoutHistory as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<HistoryPage />);
    expect(screen.getByText(/Loading history/i)).toBeInTheDocument();
  });

  it('renders error state', async () => {
    (getWorkoutHistory as jest.Mock).mockRejectedValue(
      new Error('Load failed'),
    );
    render(<HistoryPage />);
    await waitFor(() =>
      expect(screen.getByText(/Load failed/i)).toBeInTheDocument(),
    );
  });

  it('renders workouts with grouped exercises and notes', async () => {
    const mockData = [
      {
        id: '1',
        date: '2024-01-01',
        routine: 'Legs',
        duration: '50 min',
        exercises: [
          { name: 'Squat', reps: 10, sets: '1', weight: '80kg' },
          { name: 'Squat', reps: 10, sets: '2', weight: '80kg' },
        ],
        notes: 'Felt strong',
      },
    ];
    (getWorkoutHistory as jest.Mock).mockResolvedValue(mockData);
    render(<HistoryPage />);
    await screen.findByText('Legs');
    expect(screen.getByText('2x10')).toBeInTheDocument();
    expect(screen.getByText('80kg')).toBeInTheDocument();
    expect(screen.getByText(/Felt strong/i)).toBeInTheDocument();
  });

  it('filters by exercise name', async () => {
    const mockData = [
      {
        id: '1',
        date: '2024-01-01',
        routine: 'Cardio',
        duration: '30 min',
        exercises: [{ name: 'Burpees', reps: 15, sets: '1', weight: '0kg' }],
        notes: '',
      },
    ];
    (getWorkoutHistory as jest.Mock).mockResolvedValue(mockData);
    render(<HistoryPage />);
    await screen.findByText('Cardio');

    const input = screen.getByPlaceholderText(/Search routine or exercise/i);
    expect(input).toBeInTheDocument();
    userEvent.type(input, 'Burpees');
    await screen.findByText('Burpees');
  });

  it('renders empty state when no workouts exist', async () => {
    (getWorkoutHistory as jest.Mock).mockResolvedValue([]);
    render(<HistoryPage />);
    await screen.findByText(/No training found/i);
  });

  it('does not render notes section if notes are missing', async () => {
    const mockData = [
      {
        id: '1',
        date: '2024-01-01',
        routine: 'Legs',
        duration: '50 min',
        exercises: [{ name: 'Squat', reps: 10, sets: '1', weight: '80kg' }],
        notes: '',
      },
    ];
    (getWorkoutHistory as jest.Mock).mockResolvedValue(mockData);
    render(<HistoryPage />);
    await screen.findByText('Legs');
    expect(screen.queryByText(/Notes:/i)).not.toBeInTheDocument();
  });

  it('computes stats correctly when no workouts', async () => {
    (getWorkoutHistory as jest.Mock).mockResolvedValue([]);
    render(<HistoryPage />);
    await screen.findByText('0');
    screen.getByText('0h 0m');
    screen.getByText('0 min');
  });

  it('displays formatted date correctly', async () => {
    const mockData = [
      {
        id: '1',
        date: '2024-06-14T00:00:00Z',
        routine: 'Push',
        duration: '40 min',
        exercises: [
          { name: 'Bench Press', reps: 10, sets: '1', weight: '60kg' },
        ],
        notes: '',
      },
    ];
    (getWorkoutHistory as jest.Mock).mockResolvedValue(mockData);
    render(<HistoryPage />);
    const date = new Date('2024-06-14T00:00:00Z').toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    await screen.findByText(date);
  });
});
