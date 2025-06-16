import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm, useFieldArray } from 'react-hook-form';
import RoutineExercisesCard from '@/components/Routine/RoutineExercisesCard';
import { Form } from '@/components/ui/form';
import { RoutineFormFields } from '@/utils/validators/routineSchema';

function Wrapper() {
  const form = useForm<RoutineFormFields>({
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

  const clearAllExercises = () => remove([...Array(fields.length).keys()]);

  return (
    <Form {...form}>
      <RoutineExercisesCard
        form={form}
        fields={fields}
        append={append}
        remove={remove}
        clearAllExercises={clearAllExercises}
      />
    </Form>
  );
}

describe('<RoutineExercisesCard />', () => {
  it('renders placeholder when no exercises are added', () => {
    render(<Wrapper />);
    expect(screen.getByText(/no exercises added yet/i)).toBeInTheDocument();
    expect(
      screen.getByText(/click on .*add exercise.* to start/i),
    ).toBeInTheDocument();
  });

  it('renders Add and Clear buttons', () => {
    render(<Wrapper />);
    expect(
      screen.getByRole('button', { name: /add exercise/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /clear all exercises/i }),
    ).toBeInTheDocument();
  });
});
