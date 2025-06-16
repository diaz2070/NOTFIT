import { Prisma } from '@prisma/client';
import type { WorkoutLog, WorkoutLogEntry, Exercise } from '@prisma/client';

export type RoutineWithExercises = Prisma.RoutineGetPayload<{
  include: {
    exercises: {
      include: {
        exercise: true;
      };
    };
  };
}>;

export type CompletedSet = {
  reps: number;
  weight: number;
  completed: boolean;
  entryId?: string;
};

export type LoggedExercise = {
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  targetReps: number;
  targetWeight: number;
  completedSets: CompletedSet[];
  order: number;
};

export type WorkoutEntryWithExercise = {
  exerciseId: string;
  reps: number;
  weight: number;
  completed: boolean;
  exercise: {
    name: string;
  };
};

export type WorkoutLogWithEntries = WorkoutLog & {
  entries: (WorkoutLogEntry & {
    exercise: Exercise & {
      routines: {
        order: number;
        sets: number;
        reps: number;
        targetWeight: number;
      }[];
    };
  })[];
};

export type RoutineExerciseDraft = {
  id: string; // temp ID, not persisted yet
  name: string; // name of the exercise
  sets: number;
  reps: number;
  weight: number; // corresponds to `targetWeight` in DB
  notes: string; // corresponds to `note` in DB
};
