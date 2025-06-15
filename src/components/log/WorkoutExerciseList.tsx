'use client';

import React from 'react';
import type { LoggedExercise, CompletedSet } from '@/types/routine';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import InputNumeric from './InputNumeric';

interface WorkoutExerciseListProps {
  exercises: LoggedExercise[];
  updateSet: (
    exerciseIndex: number,
    setIndex: number,
    field: keyof CompletedSet,
    value: number | boolean,
  ) => void;
  toggleSetComplete: (exerciseIndex: number, setIndex: number) => void;
  getCompletedSets: (exercise: LoggedExercise) => number;
}

export default function WorkoutExerciseList({
  exercises,
  updateSet,
  toggleSetComplete,
  getCompletedSets,
}: Readonly<WorkoutExerciseListProps>) {
  return (
    <div className="space-y-6">
      {exercises.map((exercise, exerciseIndex) => (
        <Card key={exercise.exerciseId}>
          <CardHeader className="px-3 md:px-6">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                {exercise.exerciseName.charAt(0).toUpperCase() +
                  exercise.exerciseName.slice(1)}
              </CardTitle>
              <Badge
                variant={
                  getCompletedSets(exercise) === exercise.targetSets
                    ? 'default'
                    : 'secondary'
                }
              >
                {getCompletedSets(exercise)}/{exercise.targetSets} series
              </Badge>
            </div>
            <CardDescription>
              Goal: {exercise.targetSets} sets × {exercise.targetReps} reps @{' '}
              {exercise.targetWeight}lbs
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 md:px-6">
            <div className="space-y-3 bg-card">
              {exercise.completedSets.map((set, setIndex) => (
                <div
                  key={`${exercise.exerciseId}-set-${setIndex}`}
                  className="flex gap-3 py-3 px-1 md:px-3 bg-card rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium w-8">
                      S{setIndex + 1}
                    </span>
                    <Button
                      type="button"
                      variant={set.completed ? 'default' : 'outline'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleSetComplete(exerciseIndex, setIndex)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex items-center gap-1">
                      <InputNumeric
                        value={set.reps}
                        onValidChange={(val) =>
                          updateSet(exerciseIndex, setIndex, 'reps', val)
                        }
                        className="w-16 h-8 text-center"
                      />
                      <span className="text-xs text-gray-500">reps</span>
                    </div>

                    <span className="text-gray-400">×</span>

                    <div className="flex items-center gap-1">
                      <InputNumeric
                        value={set.weight}
                        onValidChange={(val) =>
                          updateSet(exerciseIndex, setIndex, 'weight', val)
                        }
                        allowDecimals
                        className="w-20 h-8 text-center"
                      />
                      <span className="text-xs text-gray-500">lbs</span>
                    </div>
                  </div>

                  {set.completed && (
                    <Badge
                      variant="default"
                      className="text-xs hidden md:flex items-center w-fit h-fit"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Completada
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
