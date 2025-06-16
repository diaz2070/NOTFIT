import editWorkoutLog from '@/actions/editWorkoutLog';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';

jest.mock('@/db/prisma', () => ({
  prisma: {
    workoutLogEntry: {
      update: jest.fn(),
    },
    workoutLog: {
      update: jest.fn(),
    },
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('editWorkoutLog', () => {
  const mockLogId = 'log123';
  const mockData = {
    notes: 'Great workout!',
    entries: [
      { id: 'entry1', reps: 10, weight: 50, completed: true },
      { id: 'entry2', reps: 8, weight: 60, completed: false },
    ],
  };

  it('updates all workoutLogEntries and the workoutLog comment', async () => {
    await editWorkoutLog(mockLogId, mockData);

    expect(prisma.workoutLogEntry.update).toHaveBeenCalledTimes(2);

    expect(prisma.workoutLogEntry.update).toHaveBeenCalledWith({
      where: { id: 'entry1' },
      data: { reps: 10, weight: 50, completed: true },
    });

    expect(prisma.workoutLogEntry.update).toHaveBeenCalledWith({
      where: { id: 'entry2' },
      data: { reps: 8, weight: 60, completed: false },
    });

    expect(prisma.workoutLog.update).toHaveBeenCalledWith({
      where: { id: mockLogId },
      data: { comment: 'Great workout!' },
    });

    expect(revalidatePath).toHaveBeenCalledWith('/history');
  });
});
