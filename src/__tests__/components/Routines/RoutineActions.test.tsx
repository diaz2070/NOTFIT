/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import RoutineActions from '@/components/Routine/RoutineActions';
import { RoutineFormFields } from '@/utils/validators/routineSchema';
import '@testing-library/jest-dom';

type WrapperProps = {
  isPending: boolean;
  hasExercises: boolean;
  routineName?: string;
  selectedDays?: string[];
};

function RoutineActionsWrapper({
  isPending,
  hasExercises,
  routineName = 'Push Day',
  selectedDays = ['Monday'],
}: Readonly<WrapperProps>) {
  const methods = useForm<RoutineFormFields>({
    defaultValues: {
      routineName,
      selectedDays,
      exercises: [],
    },
  });

  return (
    <FormProvider {...methods}>
      <RoutineActions
        form={methods}
        isPending={isPending}
        hasExercises={hasExercises}
      />
    </FormProvider>
  );
}

describe('<RoutineActions />', () => {
  it('enables submit button when form is valid', () => {
    render(<RoutineActionsWrapper isPending={false} hasExercises />);
    expect(
      screen.getByRole('button', { name: /create routine/i }),
    ).toBeEnabled();
  });

  it('disables submit button if no name', () => {
    render(
      <RoutineActionsWrapper isPending={false} hasExercises routineName="" />,
    );
    expect(
      screen.getByRole('button', { name: /create routine/i }),
    ).toBeDisabled();
  });

  it('disables submit button if no days selected', () => {
    render(
      <RoutineActionsWrapper
        isPending={false}
        hasExercises
        selectedDays={[]}
      />,
    );
    expect(
      screen.getByRole('button', { name: /create routine/i }),
    ).toBeDisabled();
  });

  it('disables submit button if no exercises', () => {
    render(<RoutineActionsWrapper isPending={false} hasExercises={false} />);
    expect(
      screen.getByRole('button', { name: /create routine/i }),
    ).toBeDisabled();
  });

  it('shows loader when pending', () => {
    render(<RoutineActionsWrapper isPending hasExercises />);
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
  });

  it('renders discard link', () => {
    render(<RoutineActionsWrapper isPending={false} hasExercises />);
    const discardLink = screen.getByRole('link', { name: /discard/i });
    expect(discardLink).toHaveAttribute('href', '/routines');
  });
});
