import deleteWorkoutLogAction from '@/actions/deleteWorkoutLog';
import { prisma } from '@/db/prisma';
import handleError from '@/utils/handle';

jest.mock('@/db/prisma', () => ({
  prisma: {
    workoutLog: {
      delete: jest.fn(),
    },
  },
}));

jest.mock('@/utils/handle', () => ({
  __esModule: true,
  default: jest.fn(() => ({ status: 500, errorMessage: 'Unhandled error' })),
}));

describe('deleteWorkoutLogAction', () => {
  const workoutId = 'workout123';
  const userId = 'user456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error if workoutId or userId is missing', async () => {
    const res1 = await deleteWorkoutLogAction('', userId);
    expect(res1).toEqual({
      status: 400,
      success: false,
      errorMessage: 'Missing parameters',
    });

    const res2 = await deleteWorkoutLogAction(workoutId, '');
    expect(res2).toEqual({
      status: 400,
      success: false,
      errorMessage: 'Missing parameters',
    });
  });

  it('deletes the workout log and returns success', async () => {
    (prisma.workoutLog.delete as jest.Mock).mockResolvedValue({});

    const result = await deleteWorkoutLogAction(workoutId, userId);

    expect(prisma.workoutLog.delete).toHaveBeenCalledWith({
      where: {
        id: workoutId,
        userId,
      },
    });

    expect(result).toEqual({
      status: 200,
      success: true,
      errorMessage: null,
    });
  });

  it('handles exceptions and returns handled error', async () => {
    const fakeError = new Error('DB failure');
    (prisma.workoutLog.delete as jest.Mock).mockRejectedValue(fakeError);

    const result = await deleteWorkoutLogAction(workoutId, userId);

    expect(handleError).toHaveBeenCalledWith(fakeError);
    expect(result).toEqual({
      status: 500,
      success: false,
      errorMessage: 'Unhandled error',
    });
  });
});
