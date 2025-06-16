export type Exercise = {
  name: string;
  reps: number;
  sets: string;
  weight: string;
};

export type Workout = {
  id: string;
  date: string | Date;
  routine: string;
  duration?: string;
  exercises: Exercise[];
  notes: string | null;
};

export type GroupedExercise = {
  name: string;
  reps: number;
  weight: string;
  sets: number;
};
