import isWorkoutValid from '@/utils/validators/workout';
import type { LoggedExercise } from '@/types/routine';

describe('isWorkoutValid', () => {
  it('returns true for valid workout data', () => {
    const data: LoggedExercise[] = [
      {
        exerciseId: '1',
        exerciseName: 'Bench Press',
        targetSets: 3,
        targetReps: 10,
        targetWeight: 100,
        completedSets: [
          { reps: 10, weight: 100, completed: true },
          { reps: 10, weight: 100, completed: true },
          { reps: 10, weight: 100, completed: true },
        ],
        order: 0,
      },
    ];

    expect(isWorkoutValid(data)).toBe(true);
  });

  it('returns false if any set has non-positive reps', () => {
    const data: LoggedExercise[] = [
      {
        exerciseId: '1',
        exerciseName: 'Squat',
        targetSets: 2,
        targetReps: 10,
        targetWeight: 120,
        completedSets: [
          { reps: 10, weight: 120, completed: true },
          { reps: 0, weight: 120, completed: true },
        ],
        order: 0,
      },
    ];

    expect(isWorkoutValid(data)).toBe(false);
  });

  it('returns false if any set has negative weight', () => {
    const data: LoggedExercise[] = [
      {
        exerciseId: '1',
        exerciseName: 'Deadlift',
        targetSets: 1,
        targetReps: 5,
        targetWeight: 150,
        completedSets: [{ reps: 5, weight: -10, completed: true }],
        order: 0,
      },
    ];

    expect(isWorkoutValid(data)).toBe(false);
  });

  it('returns false if reps is not a number', () => {
    const data: LoggedExercise[] = [
      {
        exerciseId: '1',
        exerciseName: 'Row',
        targetSets: 1,
        targetReps: 8,
        targetWeight: 90,
        completedSets: [
          { reps: '10' as unknown as number, weight: 90, completed: true },
        ],
        order: 0,
      },
    ];

    expect(isWorkoutValid(data)).toBe(false);
  });

  it('returns false if weight is not a number', () => {
    const data: LoggedExercise[] = [
      {
        exerciseId: '1',
        exerciseName: 'Pull-up',
        targetSets: 1,
        targetReps: 10,
        targetWeight: 0,
        completedSets: [
          {
            reps: 10,
            weight: 'bodyweight' as unknown as number,
            completed: true,
          },
        ],
        order: 0,
      },
    ];

    expect(isWorkoutValid(data)).toBe(false);
  });
});
