import getWorkoutHistory from '@/actions/workoutHistory';
import { prisma } from '@/db/prisma';
import { getUser } from '@/auth/server';

jest.mock('@/db/prisma', () => ({
  prisma: {
    workoutLog: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('@/auth/server', () => ({
  getUser: jest.fn(),
}));

describe('getWorkoutHistory', () => {
  it('returns empty array if user is not authenticated', async () => {
    (getUser as jest.Mock).mockResolvedValue(null);

    const result = await getWorkoutHistory();
    expect(result).toEqual([]);
  });

  it('returns mapped workout logs for authenticated user', async () => {
    (getUser as jest.Mock).mockResolvedValue({ id: 'user-123' });
    (prisma.workoutLog.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'log-1',
        date: new Date('2024-01-01'),
        startTime: new Date('2024-01-01T10:00:00'),
        endTime: new Date('2024-01-01T10:30:00'),
        comment: 'Good session',
        routine: { name: 'Push Day' },
        entries: [
          {
            exercise: { name: 'Bench Press' },
            reps: 10,
            setNumber: 1,
            weight: 80,
          },
        ],
      },
    ]);

    const result = await getWorkoutHistory();
    expect(result).toEqual([
      {
        id: 'log-1',
        date: new Date('2024-01-01'),
        routine: 'Push Day',
        duration: '30 min',
        exercises: [
          {
            name: 'Bench Press',
            reps: 10,
            sets: '1',
            weight: '80lbs',
          },
        ],
        notes: 'Good session',
      },
    ]);
  });
});
