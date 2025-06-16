/**
 * @jest-environment node
 */
import {
  startWorkoutLog,
  saveWorkoutLog,
  pauseWorkoutLog,
  resumeWorkoutLog,
  getWorkoutLog,
  deleteWorkoutLog,
} from '@/actions/workoutLog';
import { prisma } from '@/db/prisma';
import { getUser } from '@/auth/server';
import handleError from '@/utils/handle';

jest.mock('@/db/prisma', () => ({
  prisma: {
    workoutLog: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    workoutLogEntry: {
      deleteMany: jest.fn(),
    },
  },
}));
jest.mock('@/auth/server');
jest.mock('@/utils/handle');

const mockUser = { id: 'user1' };
const routineId = 'routine123';
const logId = 'log123';

describe('Workout Log Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('startWorkoutLog', () => {
    it('returns 200 and log ID when user is authenticated', async () => {
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.create as jest.Mock).mockResolvedValue({ id: logId });

      const result = await startWorkoutLog(routineId);
      expect(result.status).toBe(200);
      expect(result.data).toEqual({ logId });
    });

    it('throws if user is not authenticated', async () => {
      (getUser as jest.Mock).mockResolvedValue(null);
      await expect(startWorkoutLog(routineId)).rejects.toThrow(
        'Not authenticated',
      );
    });

    it('returns error if Prisma fails', async () => {
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.create as jest.Mock).mockRejectedValue(
        new Error('fail'),
      );
      (handleError as jest.Mock).mockReturnValue({
        status: 500,
        errorMessage: 'fail',
      });

      const result = await startWorkoutLog(routineId);
      expect(result.status).toBe(500);
    });
  });

  describe('saveWorkoutLog', () => {
    const mockFormData = new FormData();
    const logPayload = {
      logId,
      routineId,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      notes: 'note',
      workoutData: [
        {
          exerciseId: 'ex1',
          order: 1,
          completedSets: [
            { reps: 10, weight: 50, completed: true },
            { reps: 8, weight: 55, completed: false },
          ],
        },
      ],
    };
    mockFormData.set('log', JSON.stringify(logPayload));

    it('returns 401 if unauthenticated', async () => {
      (getUser as jest.Mock).mockResolvedValue(null);
      const result = await saveWorkoutLog(null, mockFormData);
      expect(result.status).toBe(401);
    });

    it('saves log and returns 200', async () => {
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.update as jest.Mock).mockResolvedValue({});
      (prisma.workoutLogEntry.deleteMany as jest.Mock).mockResolvedValue({});

      const result = await saveWorkoutLog(null, mockFormData);
      expect(result.status).toBe(200);
      expect(result.data).toEqual({ logId });
    });

    it('returns error if saving fails', async () => {
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.update as jest.Mock).mockRejectedValue(
        new Error('fail'),
      );
      (handleError as jest.Mock).mockReturnValue({
        status: 500,
        errorMessage: 'fail',
      });

      const result = await saveWorkoutLog(null, mockFormData);
      expect(result.status).toBe(500);
    });

    it('returns error if Prisma fails', async () => {
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.create as jest.Mock).mockRejectedValue(
        new Error('db fail'),
      );

      (handleError as jest.Mock).mockReturnValue({
        status: 500,
        errorMessage: 'Something went wrong',
      });

      const result = await startWorkoutLog(routineId);

      expect(handleError).toHaveBeenCalled();
      expect(result.status).toBe(500);
      expect(result.errorMessage).toBe('Something went wrong');
      expect(result.data).toBeNull();
    });
  });

  describe('pauseWorkoutLog', () => {
    const pausedFormData = new FormData();
    pausedFormData.set(
      'log',
      JSON.stringify({
        logId,
        workoutData: [
          {
            exerciseId: 'ex1',
            order: 1,
            completedSets: [
              { reps: 10, weight: 50, completed: true },
              { reps: 8, weight: 55, completed: false },
            ],
          },
        ],
      }),
    );

    it('returns 401 if unauthenticated', async () => {
      (getUser as jest.Mock).mockResolvedValue(null);
      const result = await pauseWorkoutLog(null, pausedFormData);
      expect(result.status).toBe(401);
    });

    it('returns 404 if log not found', async () => {
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await pauseWorkoutLog(null, pausedFormData);
      expect(result.status).toBe(404);
    });

    it('returns 400 if already paused', async () => {
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.findUnique as jest.Mock).mockResolvedValue({
        id: logId,
        pausedAt: new Date(),
      });

      const result = await pauseWorkoutLog(null, pausedFormData);
      expect(result.status).toBe(400);
    });

    it('pauses successfully', async () => {
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.findUnique as jest.Mock).mockResolvedValue({
        id: logId,
        pausedAt: null,
      });
      (prisma.workoutLog.update as jest.Mock).mockResolvedValue({ id: logId });
      (prisma.workoutLogEntry.deleteMany as jest.Mock).mockResolvedValue({});

      const result = await pauseWorkoutLog(null, pausedFormData);
      expect(result.status).toBe(200);
    });

    it('returns error if pause fails', async () => {
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.findUnique as jest.Mock).mockResolvedValue({
        id: logId,
        pausedAt: null,
      });
      (prisma.workoutLog.update as jest.Mock).mockRejectedValue(
        new Error('pause fail'),
      );
      (handleError as jest.Mock).mockReturnValue({
        status: 500,
        errorMessage: 'pause error',
      });

      const result = await pauseWorkoutLog(null, pausedFormData);
      expect(handleError).toHaveBeenCalled();
      expect(result.status).toBe(500);
      expect(result.data).toBeNull();
    });
  });

  describe('resumeWorkoutLog', () => {
    it('returns 401 if unauthenticated', async () => {
      (getUser as jest.Mock).mockResolvedValue(null);
      const result = await resumeWorkoutLog(logId);
      expect(result.status).toBe(401);
    });

    it('returns 400 if no pausedAt', async () => {
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.findUnique as jest.Mock).mockResolvedValue({
        id: logId,
        pausedAt: null,
      });

      const result = await resumeWorkoutLog(logId);
      expect(result.status).toBe(400);
    });

    it('resumes workout', async () => {
      const now = new Date();
      const pausedAt = new Date(now.getTime() - 30000);

      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.findUnique as jest.Mock).mockResolvedValue({
        id: logId,
        pausedAt,
        totalPaused: 60,
      });
      (prisma.workoutLog.update as jest.Mock).mockResolvedValue({ id: logId });

      const result = await resumeWorkoutLog(logId);
      expect(result.status).toBe(200);
    });

    it('returns error if resume fails', async () => {
      const pausedAt = new Date(Date.now() - 10000);
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.findUnique as jest.Mock).mockResolvedValue({
        id: logId,
        pausedAt,
        totalPaused: 0,
      });
      (prisma.workoutLog.update as jest.Mock).mockRejectedValue(
        new Error('resume fail'),
      );
      (handleError as jest.Mock).mockReturnValue({
        status: 500,
        errorMessage: 'resume error',
      });

      const result = await resumeWorkoutLog(logId);
      expect(handleError).toHaveBeenCalled();
      expect(result.status).toBe(500);
    });
  });

  describe('getWorkoutLog', () => {
    it('returns 401 if unauthenticated', async () => {
      (getUser as jest.Mock).mockResolvedValue(null);
      const result = await getWorkoutLog(logId);
      expect(result.status).toBe(401);
    });

    it('returns 404 if base log not found', async () => {
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const result = await getWorkoutLog(logId);
      expect(result.status).toBe(404);
    });

    it('returns 200 and full log if found', async () => {
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.findUnique as jest.Mock)
        .mockResolvedValueOnce({ routineId })
        .mockResolvedValueOnce({ id: logId, entries: [] });

      const result = await getWorkoutLog(logId);
      expect(result.status).toBe(200);
    });

    it('returns error if second fetch fails', async () => {
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.findUnique as jest.Mock)
        .mockResolvedValueOnce({ routineId })
        .mockRejectedValueOnce(new Error('get log fail'));
      (handleError as jest.Mock).mockReturnValue({
        status: 500,
        errorMessage: 'get error',
      });

      const result = await getWorkoutLog(logId);
      expect(handleError).toHaveBeenCalled();
      expect(result.status).toBe(500);
      expect(result.data).toBeNull();
    });
  });

  describe('deleteWorkoutLog', () => {
    it('returns 401 if unauthenticated', async () => {
      (getUser as jest.Mock).mockResolvedValue(null);
      const result = await deleteWorkoutLog(logId);
      expect(result.status).toBe(401);
    });

    it('returns 404 if not found', async () => {
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await deleteWorkoutLog(logId);
      expect(result.status).toBe(404);
    });

    it('deletes workout log', async () => {
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.findUnique as jest.Mock).mockResolvedValue({
        id: logId,
      });
      (prisma.workoutLog.delete as jest.Mock).mockResolvedValue({});

      const result = await deleteWorkoutLog(logId);
      expect(result.status).toBe(200);
    });

    it('returns error if deletion fails', async () => {
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (prisma.workoutLog.findUnique as jest.Mock).mockResolvedValue({
        id: logId,
      });
      (prisma.workoutLog.delete as jest.Mock).mockRejectedValue(
        new Error('delete fail'),
      );
      (handleError as jest.Mock).mockReturnValue({
        status: 500,
        errorMessage: 'delete error',
      });

      const result = await deleteWorkoutLog(logId);
      expect(handleError).toHaveBeenCalled();
      expect(result.status).toBe(500);
    });
  });
});
