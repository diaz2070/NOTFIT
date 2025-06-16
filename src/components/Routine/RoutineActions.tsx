'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { RoutineFormFields } from '@/utils/validators/routineSchema';

type Props = {
  form: UseFormReturn<RoutineFormFields>;
  isPending: boolean;
  hasExercises: boolean;
};

export default function RoutineActions({
  form,
  isPending,
  hasExercises,
}: Readonly<Props>) {
  const routineName = form.watch('routineName');
  const selectedDays = form.watch('selectedDays');

  const isDisabled =
    !routineName || selectedDays.length === 0 || !hasExercises || isPending;

  return (
    <div className="flex gap-4">
      <Button
        type="submit"
        className="flex-1 font-[family-name:var(--font-lemon)]"
        disabled={isDisabled}
      >
        {isPending ? (
          <Loader2 data-testid="loader-icon" className="animate-spin" />
        ) : (
          'Create Routine'
        )}
      </Button>
      <Button type="button" variant="outline" asChild>
        <Link href="/routines">Discard</Link>
      </Button>
    </div>
  );
}
