import { getRoutinesAction, createRoutineAction } from '@/actions/routines';
import { prisma } from '@/db/prisma';
import {
  ExerciseCategory,
  MuscleTarget,
  Routine,
  RoutineExercise,
  Exercise,
} from '@prisma/client';
import { getUser } from '@/auth/server';

jest.mock('@/db/prisma', () => ({
  prisma: {
    routine: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('@/auth/server', () => ({
  getUser: jest.fn(),
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
  exercises: [
    {
      id: 'ex-1',
      routineId: '1',
      exerciseId: 'ex-10',
      order: 1,
      sets: 3,
      reps: 12,
      restTime: 60,
      targetWeight: 0,
      note: null,
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

const validFormData = {
  routineName: 'Leg Day',
  selectedDays: ['Monday', 'Wednesday'],
  exercises: [
    {
      id: 'ex-10',
      name: 'Squat',
      sets: 3,
      reps: 12,
      weight: 100,
      imageUrl: 'https://example.com/squat.jpg',
      notes: 'Use proper form',
    },
  ],
};

const mockUser = { id: 'user-123' };

describe('getRoutinesAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 if no user ID is provided', async () => {
    const res = await getRoutinesAction('');
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

describe('createRoutineAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when validation fails', async () => {
    const invalidData = { ...validFormData, routineName: '' };
    const result = await createRoutineAction(invalidData);
    expect(result.status).toBe(400);
    expect(result.data).toBeNull();
    expect(result.errorMessage).toContain('Routine name is required');
  });

  it('returns 401 when user is not authenticated', async () => {
    (getUser as jest.Mock).mockResolvedValue(null);
    const result = await createRoutineAction(validFormData);
    expect(result.status).toBe(401);
    expect(result.errorMessage).toBe('Unauthorized');
  });

  it('returns 200 and routine id when created successfully', async () => {
    (getUser as jest.Mock).mockResolvedValue(mockUser);
    (prisma.routine.create as jest.Mock).mockResolvedValue({ id: 'r1' });

    const result = await createRoutineAction(validFormData);
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ id: 'r1' });
    expect(result.errorMessage).toBeNull();
  });

  it('returns 500 on database error', async () => {
    (getUser as jest.Mock).mockResolvedValue(mockUser);
    (prisma.routine.create as jest.Mock).mockRejectedValue(new Error('fail'));

    const result = await createRoutineAction(validFormData);
    expect(result.status).toBe(500);
    expect(result.data).toBeNull();
    expect(result.errorMessage).toBe('Unexpected error');
  });
});
