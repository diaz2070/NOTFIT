'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Form } from '@/components/ui/form';

import {
  routineSchema,
  RoutineFormFields,
} from '@/utils/validators/routineSchema';
import { createRoutineAction } from '@/actions/routines';
import RoutineHeader from '@/components/Routine/RoutineHeader';
import RoutineBasicDetails from '@/components/Routine/RoutineBasicDetails';
import RoutineExercisesCard from '@/components/Routine/RoutineExercisesCard';
import RoutineActions from '@/components/Routine/RoutineActions';

export default function NewRoutinePage() {
  const form = useForm<RoutineFormFields>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      routineName: '',
      selectedDays: [],
      exercises: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'exercises',
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmitRoutine = (values: RoutineFormFields) => {
    startTransition(async () => {
      const result = await createRoutineAction(values);

      if (result.status === 200 && result.data) {
        toast.success('Routine created successfully!');
        router.push('/routines');
      } else {
        toast.error(result.errorMessage ?? 'Failed to create routine');
      }
    });
  };

  const clearAllExercises = () => {
    remove([...Array(fields.length).keys()]);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <RoutineHeader
          title="New Routine Details"
          subtitle="Create a new custom workout routine"
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitRoutine)}
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
            />
          </form>
        </Form>
      </main>
    </div>
  );
}
