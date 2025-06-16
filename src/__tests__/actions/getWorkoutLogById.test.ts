import getWorkoutLogById from '@/actions/getWorkoutById';
import { prisma } from '@/db/prisma';

jest.mock('@/db/prisma', () => ({
  prisma: {
    workoutLog: {
      findUnique: jest.fn(),
    },
  },
}));

describe('getWorkoutLogById', () => {
  const mockId = 'log123';

  it('calls prisma.workoutLog.findUnique with correct params', async () => {
    const mockData = { id: mockId, routine: {}, entries: [] };
    (prisma.workoutLog.findUnique as jest.Mock).mockResolvedValue(mockData);

    const result = await getWorkoutLogById(mockId);

    expect(prisma.workoutLog.findUnique).toHaveBeenCalledWith({
      where: { id: mockId },
      include: {
        routine: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
            },
          },
        },
        entries: {
          include: {
            exercise: {
              include: {
                routines: true,
              },
            },
          },
        },
      },
    });
    expect(result).toBe(mockData);
  });

  it('returns null if log is not found', async () => {
    (prisma.workoutLog.findUnique as jest.Mock).mockResolvedValue(null);
    const result = await getWorkoutLogById('invalid-id');
    expect(result).toBeNull();
  });

  it('throws error if prisma fails', async () => {
    (prisma.workoutLog.findUnique as jest.Mock).mockRejectedValue(
      new Error('DB error'),
    );

    await expect(getWorkoutLogById(mockId)).rejects.toThrow('DB error');
  });
});
