import getRoutinesAction from '@/actions/routines';
import { prisma } from '@/db/prisma';
import {
  ExerciseCategory,
  MuscleTarget,
  Routine,
  RoutineExercise,
  Exercise,
} from '@prisma/client';

jest.mock('@/db/prisma', () => ({
  prisma: {
    routine: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('@/utils/handle', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    status: 500,
    errorMessage: 'Unexpected error',
  })),
}));

const mockRoutine: Routine & {
  exercises: (RoutineExercise & {
    exercise: Exercise;
  })[];
} = {
  id: '1',
  name: 'Routine A',
  description: 'Sample routine',
  daysOfWeek: ['Monday', 'Wednesday'],
  userId: 'user-123',
  createdAt: new Date(),
  updatedAt: new Date(),
  workoutLogs: [],
  exercises: [
    {
      id: 'ex-1',
      routineId: '1',
      exerciseId: 'ex-10',
      order: 1,
      sets: 3,
      reps: 12,
      restTime: 60,
      exercise: {
        id: 'ex-10',
        name: 'Squat',
        category: ExerciseCategory.Upper_Legs,
        primaryMuscles: [MuscleTarget.Glutes],
        secondaryMuscles: [],
        instructions: ['Bajar', 'Subir'],
        description: 'Sentadillas',
        imageUrl: '',
        createdAt: new Date(),
      },
    },
  ],
};

describe('getRoutinesAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 if no user ID is provided', async () => {
    const res = await getRoutinesAction(undefined);
    expect(res.status).toBe(400);
    expect(res.data).toBeNull();
    expect(res.errorMessage).toBe('Missing user ID');
  });

  it('returns 200 and routines if found', async () => {
    (prisma.routine.findMany as jest.Mock).mockResolvedValue([mockRoutine]);

    const res = await getRoutinesAction('user-123');
    expect(res.status).toBe(200);
    expect(res.data).toEqual([mockRoutine]);
    expect(res.errorMessage).toBeNull();
  });

  it('returns 500 on unexpected error', async () => {
    (prisma.routine.findMany as jest.Mock).mockRejectedValue(new Error('fail'));

    const res = await getRoutinesAction('user-123');
    expect(res.status).toBe(500);
    expect(res.data).toBeNull();
    expect(res.errorMessage).toBe('Unexpected error');
  });
});
