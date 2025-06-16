import getExercisesAction from '@/actions/exercises';
import { prisma } from '@/db/prisma';
import {
  FilteredExerciseInput,
  filteredExerciseSchema,
} from '@/utils/validators/filteredExerciseSchema';
import { ExerciseCategory, MuscleTarget } from '@prisma/client';

jest.mock('@/db/prisma', () => ({
  prisma: {
    exercise: {
      findMany: jest.fn(),
      count: jest.fn(),
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

const validFilters = filteredExerciseSchema.parse({
  search: '',
  category: 'all',
  muscle: 'all',
  sort: 'name',
  take: 10,
  page: 1,
});

const mockExercise = {
  id: '1',
  name: 'Push Up',
  category: ExerciseCategory.Chest,
  primaryMuscles: [MuscleTarget.Pectorals],
  secondaryMuscles: [],
  description: 'Upper body',
  instructions: ['Push up and down'],
  imageUrl: '',
  createdAt: new Date(),
};

const invalidFilters = {
  search: '',
  category: 'INVALID_CATEGORY',
  muscle: 'INVALID_MUSCLE',
  sort: 'name',
  take: 10,
  page: 1,
} as unknown as FilteredExerciseInput;

describe('getExercisesAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 for invalid filters', async () => {
    const res = await getExercisesAction(invalidFilters);
    expect(res.status).toBe(400);
    expect(res.data).toBeNull();
    expect(res.errorMessage).toMatch(/Invalid input/);
  });

  it('returns 404 if no exercises found', async () => {
    (prisma.exercise.findMany as jest.Mock).mockResolvedValue([]);

    const res = await getExercisesAction(validFilters);
    expect(res.status).toBe(404);
    expect(res.data).toBeNull();
    expect(res.errorMessage).toBe('No exercises found');
  });

  it('returns 200 and data if exercises found', async () => {
    (prisma.exercise.findMany as jest.Mock).mockResolvedValue([mockExercise]);
    (prisma.exercise.count as jest.Mock).mockResolvedValue(1);

    const res = await getExercisesAction(validFilters);
    expect(res.status).toBe(200);
    expect(res.data?.items).toEqual([mockExercise]);
    expect(res.data?.total).toBe(1);
  });

  it('returns 500 on unexpected error', async () => {
    (prisma.exercise.findMany as jest.Mock).mockRejectedValue(
      new Error('fail'),
    );

    const res = await getExercisesAction(validFilters);
    expect(res.status).toBe(500);
    expect(res.data).toBeNull();
    expect(res.errorMessage).toBe('Unexpected error');
  });
});
