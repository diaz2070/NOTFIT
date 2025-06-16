'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Trash2Icon, Target } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ExerciseBrowserModal from '@/components/Exercise/ExerciseModal';
import InputNumeric from '@/components/log/InputNumeric';
import { Exercise } from '@prisma/client';

import type {
  UseFormReturn,
  UseFieldArrayRemove,
  UseFieldArrayAppend,
} from 'react-hook-form';
import type { RoutineFormFields } from '@/utils/validators/routineSchema';

type Props = {
  form: UseFormReturn<RoutineFormFields>;
  fields: RoutineFormFields['exercises'];
  append: UseFieldArrayAppend<RoutineFormFields, 'exercises'>;
  remove: UseFieldArrayRemove;
  clearAllExercises: () => void;
};

export default function RoutineExercisesCard({
  form,
  fields,
  append,
  remove,
  clearAllExercises,
}: Readonly<Props>) {
  const handleExerciseFromBrowser = (exercise: Exercise) => {
    append({
      id: exercise.id,
      name: exercise.name,
      sets: 3,
      reps: 10,
      weight: 0,
      notes: '',
      imageUrl: exercise.imageUrl,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
          <div>
            <CardTitle className="flex items-center mb-2 text-2xl">
              <Target className="inline h-6 w-6 mr-2" />
              Exercises
            </CardTitle>
            <CardDescription>
              Add each exercise that will be included in this routine
            </CardDescription>
          </div>
          <div className="flex flex-col md:flex-row w-full md:w-fit gap-2 mt-2 md:mt-0">
            <ExerciseBrowserModal onExerciseSelect={handleExerciseFromBrowser}>
              <Button
                type="button"
                className="font-[family-name:var(--font-lemon)]"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add exercise
              </Button>
            </ExerciseBrowserModal>
            <Button
              variant="destructive"
              className="font-[family-name:var(--font-lemon)]"
              onClick={clearAllExercises}
            >
              <Trash2Icon className="h-4 w-4 mr-1" />
              Clear all exercises
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {fields.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No exercises added yet</p>
            <p>Click on &quot;Add Exercise&quot; to start</p>
          </div>
        ) : (
          <div className="space-y-6">
            {fields.map((exercise, index) => (
              <Card
                key={exercise.id}
                className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <CardHeader className="">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl">
                      <div className="flex items-center gap-2">
                        <img
                          src={exercise.imageUrl}
                          alt={exercise.name}
                          className="h-15 w-15 object-cover rounded-2xl"
                        />
                        {exercise.name.charAt(0).toUpperCase() +
                          exercise.name.slice(1)}
                      </div>
                    </CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Sets</Label>
                      <InputNumeric
                        value={exercise.sets}
                        onValidChange={(value) =>
                          form.setValue(`exercises.${index}.sets`, value)
                        }
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Reps</Label>
                      <InputNumeric
                        value={exercise.reps}
                        onValidChange={(value) =>
                          form.setValue(`exercises.${index}.reps`, value)
                        }
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Goal Weight (lbs)</Label>
                      <InputNumeric
                        value={exercise.weight}
                        onValidChange={(value) =>
                          form.setValue(`exercises.${index}.weight`, value)
                        }
                        allowDecimals
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Notes (optional)</Label>
                    <Textarea
                      placeholder="E.g.: Rest 90 seconds between sets"
                      value={form.watch(`exercises.${index}.notes`) ?? ''}
                      onChange={(e) =>
                        form.setValue(
                          `exercises.${index}.notes`,
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
