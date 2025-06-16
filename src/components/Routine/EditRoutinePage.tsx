'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
  RoutineFormFields,
  routineSchema,
} from '@/utils/validators/routineSchema';
import { RoutineWithExercises, updateRoutineAction } from '@/actions/routines';

import { Form } from '@/components/ui/form';
import RoutineHeader from './RoutineHeader';
import RoutineBasicDetails from './RoutineBasicDetails';
import RoutineExercisesCard from './RoutineExercisesCard';
import RoutineActions from './RoutineActions';

type Props = {
  routine: RoutineWithExercises;
};

export default function EditRoutinePage({ routine }: Readonly<Props>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const defaultValues: RoutineFormFields = {
    routineName: routine.name,
    selectedDays: routine.daysOfWeek,
    exercises: routine.exercises.map((ex) => ({
      id: ex.exerciseId,
      name: ex.exercise.name,
      reps: ex.reps,
      sets: ex.sets,
      weight: ex.targetWeight ?? 0,
      notes: ex.note ?? '',
      imageUrl: ex.exercise.imageUrl,
    })),
  };

  const form = useForm<RoutineFormFields>({
    resolver: zodResolver(routineSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'exercises',
  });

  const clearAllExercises = () => {
    remove([...Array(fields.length).keys()]);
  };

  const handleSubmit = (data: RoutineFormFields) => {
    startTransition(async () => {
      const result = await updateRoutineAction(routine.id, data);
      if (result.status === 200) {
        toast.success('Routine updated successfully!');
        router.push('/routines');
      } else {
        toast.error(result.errorMessage ?? 'Failed to update routine');
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <RoutineHeader
          title="Edit Routine Details"
          subtitle="Update your custom workout routine"
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <RoutineBasicDetails form={form} />
            <RoutineExercisesCard
              form={form}
              fields={fields}
              append={append}
              remove={remove}
              clearAllExercises={clearAllExercises}
            />
            <RoutineActions
              form={form}
              isPending={isPending}
              hasExercises={fields.length > 0}
              submitLabel="Save Changes"
            />
          </form>
        </Form>
      </main>
    </div>
  );
}
