import { render, screen } from '@testing-library/react';
import Log from '@/app/log/page';
import { getUser } from '@/auth/server';
import { getWorkoutLog } from '@/actions/workoutLog';
import { prisma } from '@/db/prisma';
import { cookies } from 'next/headers';

jest.mock('@/components/log/WorkoutLogPage', () => ({
  __esModule: true,
  default: () => <div>Mocked WorkoutLogPage</div>,
}));
jest.mock('@/auth/server', () => ({
  getUser: jest.fn(),
}));
jest.mock('@/actions/workoutLog', () => ({
  getWorkoutLog: jest.fn(),
}));
jest.mock('@/db/prisma', () => ({
  prisma: {
    routine: {
      findMany: jest.fn(),
    },
  },
}));
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('Log page (server component)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders WorkoutLogPage with data', async () => {
    (getUser as jest.Mock).mockResolvedValue({ id: 'user-123' });
    (cookies as jest.Mock).mockReturnValue({
      get: () => ({ value: 'log-456' }),
    });
    (getWorkoutLog as jest.Mock).mockResolvedValue({ data: { id: 'log-456' } });
    (prisma.routine.findMany as jest.Mock).mockResolvedValue([
      { id: 'routine-1', name: 'Routine A', exercises: [] },
    ]);

    const jsx = await Log();
    render(jsx);

    expect(
      await screen.findByText('Mocked WorkoutLogPage'),
    ).toBeInTheDocument();
    expect(getUser).toHaveBeenCalled();
    expect(getWorkoutLog).toHaveBeenCalledWith('log-456');
    expect(prisma.routine.findMany).toHaveBeenCalledWith(expect.any(Object));
  });
});
