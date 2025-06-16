import transformWorkoutLogToExercises from '@/utils/transformWorkoutEntries';
import type { WorkoutLogWithEntries } from '@/types/routine';

describe('transformWorkoutLogToExercises', () => {
  it('should transform and group workout entries correctly', () => {
    const mockLog: WorkoutLogWithEntries = {
      id: 'log1',
      userId: 'user1',
      routineId: 'routine1',
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      status: 'COMPLETED',
      totalVolume: null,
      pausedAt: null,
      totalPaused: 0,
      comment: null,
      entries: [
        {
          id: 'entry1',
          logId: 'log1',
          exerciseId: 'ex1',
          reps: 10,
          weight: 50,
          completed: true,
          createdAt: new Date(),
          setNumber: 1,
          restTime: null,
          notes: null,
          comment: null,
          completedSets: [],
          exercise: {
            id: 'ex1',
            name: 'Bench Press',
            createdAt: new Date(),
            category: 'Chest',
            primaryMuscles: ['Pectorals'],
            secondaryMuscles: ['Triceps'],
            description: 'Chest exercise',
            instructions: ['Lie down', 'Push up'],
            imageUrl: 'https://example.com/bench.jpg',
            routines: [
              {
                sets: 3,
                reps: 10,
                targetWeight: 60,
                order: 1,
              },
            ],
          },
        },
        {
          id: 'entry2',
          logId: 'log1',
          exerciseId: 'ex1',
          reps: 8,
          weight: 55,
          completed: true,
          createdAt: new Date(),
          setNumber: 2,
          restTime: null,
          notes: null,
          comment: null,
          completedSets: [],
          exercise: {
            id: 'ex1',
            name: 'Bench Press',
            createdAt: new Date(),
            category: 'Chest',
            primaryMuscles: ['Pectorals'],
            secondaryMuscles: ['Triceps'],
            description: 'Chest exercise',
            instructions: ['Lie down', 'Push up'],
            imageUrl: 'https://example.com/bench.jpg',
            routines: [
              {
                sets: 3,
                reps: 10,
                targetWeight: 60,
                order: 1,
              },
            ],
          },
        },
        {
          id: 'entry3',
          logId: 'log1',
          exerciseId: 'ex2',
          reps: 12,
          weight: 30,
          completed: false,
          createdAt: new Date(),
          setNumber: 1,
          restTime: null,
          notes: null,
          comment: null,
          completedSets: [],
          exercise: {
            id: 'ex2',
            name: 'Bicep Curl',
            createdAt: new Date(),
            category: 'Upper_Arms',
            primaryMuscles: ['Biceps'],
            secondaryMuscles: ['Forearms'],
            description: 'Arm exercise',
            instructions: ['Curl up', 'Lower slowly'],
            imageUrl: 'https://example.com/curl.jpg',
            routines: [
              {
                sets: 2,
                reps: 12,
                targetWeight: 35,
                order: 2,
              },
            ],
          },
        },
      ],
    };

    const result = transformWorkoutLogToExercises(mockLog);

    expect(result).toHaveLength(2);

    expect(result[0].exerciseId).toBe('ex1');
    expect(result[0].exerciseName).toBe('Bench Press');
    expect(result[0].targetSets).toBe(3);
    expect(result[0].targetReps).toBe(10);
    expect(result[0].targetWeight).toBe(60);
    expect(result[0].order).toBe(1);
    expect(result[0].completedSets).toEqual([
      { reps: 10, weight: 50, completed: true, entryId: 'entry1' },
      { reps: 8, weight: 55, completed: true, entryId: 'entry2' },
    ]);

    expect(result[1].exerciseId).toBe('ex2');
    expect(result[1].exerciseName).toBe('Bicep Curl');
    expect(result[1].targetSets).toBe(2);
    expect(result[1].targetReps).toBe(12);
    expect(result[1].targetWeight).toBe(35);
    expect(result[1].order).toBe(2);
    expect(result[1].completedSets).toEqual([
      { reps: 12, weight: 30, completed: false, entryId: 'entry3' },
    ]);
  });
});

describe('transformWorkoutLogToExercises', () => {
  it('should transform and group workout entries correctly', () => {
    const mockLog: WorkoutLogWithEntries = {
      id: 'log1',
      userId: 'user1',
      routineId: 'routine1',
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      status: 'COMPLETED',
      totalVolume: null,
      pausedAt: null,
      totalPaused: 0,
      comment: null,
      entries: [
        {
          id: 'entry1',
          logId: 'log1',
          exerciseId: 'ex1',
          reps: 10,
          weight: 50,
          completed: true,
          createdAt: new Date(),
          setNumber: 1,
          restTime: null,
          notes: null,
          comment: null,
          completedSets: [],
          exercise: {
            id: 'ex1',
            name: 'Bench Press',
            createdAt: new Date(),
            category: 'Chest',
            primaryMuscles: ['Pectorals'],
            secondaryMuscles: ['Triceps'],
            description: 'Chest exercise',
            instructions: ['Lie down', 'Push up'],
            imageUrl: '',
            routines: [
              {
                sets: 3,
                reps: 10,
                targetWeight: 60,
                order: 1,
              },
            ],
          },
        },
      ],
    };

    const result = transformWorkoutLogToExercises(mockLog);

    expect(result[0]).toMatchObject({
      exerciseId: 'ex1',
      exerciseName: 'Bench Press',
      targetSets: 3,
      targetReps: 10,
      targetWeight: 60,
      order: 1,
      completedSets: [{ reps: 10, weight: 50, completed: true }],
    });
  });

  it('should apply default values when routine data is missing', () => {
    const mockLog: WorkoutLogWithEntries = {
      id: 'log2',
      userId: 'user2',
      routineId: 'routine2',
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      status: 'IN_PROGRESS',
      totalVolume: null,
      pausedAt: null,
      totalPaused: 0,
      comment: null,
      entries: [
        {
          id: 'entry2',
          logId: 'log2',
          exerciseId: 'ex2',
          reps: 15,
          weight: 25,
          completed: false,
          createdAt: new Date(),
          setNumber: 1,
          restTime: null,
          notes: null,
          comment: null,
          completedSets: [],
          exercise: {
            id: 'ex2',
            name: 'Dumbbell Fly',
            createdAt: new Date(),
            category: 'Chest',
            primaryMuscles: ['Pectorals'],
            secondaryMuscles: [],
            description: 'Chest isolation',
            instructions: [],
            imageUrl: '',
            routines: [],
          },
        },
      ],
    };

    const result = transformWorkoutLogToExercises(mockLog);

    expect(result[0]).toMatchObject({
      exerciseId: 'ex2',
      exerciseName: 'Dumbbell Fly',
      targetSets: 0,
      targetReps: 0,
      targetWeight: 0,
      order: 999,
      completedSets: [{ reps: 15, weight: 25, completed: false }],
    });
  });
});
