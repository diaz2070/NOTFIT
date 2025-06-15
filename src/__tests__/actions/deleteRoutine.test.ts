// __tests__/actions/deleteRoutine.test.ts

import deleteRoutineAction from '@/actions/deleteRoutine';
import { prisma } from '@/db/prisma';
import handleError from '@/utils/handle';

jest.mock('@/db/prisma', () => ({
  prisma: {
    routine: {
      delete: jest.fn(),
    },
  },
}));

jest.mock('@/utils/handle', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    status: 500,
    errorMessage: 'Unhandled error',
  })),
}));

describe('deleteRoutineAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 if missing parameters', async () => {
    const result = await deleteRoutineAction('', '');

    expect(result).toEqual({
      status: 400,
      success: false,
      errorMessage: 'Missing parameters',
    });
  });

  it('deletes routine and returns success', async () => {
    (prisma.routine.delete as jest.Mock).mockResolvedValue({});

    const result = await deleteRoutineAction('routine123', 'user123');

    expect(prisma.routine.delete).toHaveBeenCalledWith({
      where: { id: 'routine123', userId: 'user123' },
    });

    expect(result).toEqual({
      status: 200,
      success: true,
      errorMessage: null,
    });
  });

  it('returns handled error if deletion throws', async () => {
    (prisma.routine.delete as jest.Mock).mockRejectedValue(
      new Error('DB error'),
    );

    const result = await deleteRoutineAction('routine123', 'user123');

    expect(handleError).toHaveBeenCalled();
    expect(result).toEqual({
      status: 500,
      success: false,
      errorMessage: 'Unhandled error',
    });
  });
});
