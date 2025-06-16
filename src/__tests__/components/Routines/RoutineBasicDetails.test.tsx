/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoutineBasicDetails from '@/components/Routine/RoutineBasicDetails';
import { useForm } from 'react-hook-form';
import { RoutineFormFields } from '@/utils/validators/routineSchema';
import { Form } from '@/components/ui/form';

function Wrapper({
  initial,
}: Readonly<{ initial: Partial<RoutineFormFields> }>) {
  const form = useForm<RoutineFormFields>({
    defaultValues: {
      routineName: '',
      selectedDays: [],
      exercises: [],
      ...initial,
    },
  });

  return (
    <Form {...form}>
      <RoutineBasicDetails form={form} />
    </Form>
  );
}

describe('<RoutineBasicDetails />', () => {
  it('renders input field and day checkboxes', () => {
    render(<Wrapper initial={{}} />);
    expect(screen.getByLabelText(/name of your routine/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Monday')).toBeInTheDocument();
    expect(screen.getByLabelText('Sunday')).toBeInTheDocument();
  });

  it('allows selecting and deselecting days', async () => {
    const user = userEvent.setup();
    render(<Wrapper initial={{}} />);
    const monday = screen.getByLabelText('Monday');

    expect(monday).not.toBeChecked();
    await user.click(monday);
    expect(monday).toBeChecked();
    await user.click(monday);
    expect(monday).not.toBeChecked();
  });

  it('displays selected days as sorted badges', async () => {
    const user = userEvent.setup();
    render(<Wrapper initial={{}} />);
    await user.click(screen.getByLabelText('Wednesday'));
    await user.click(screen.getByLabelText('Monday'));

    const badges = screen.getAllByText(/Monday|Wednesday/);
    expect(badges[0]).toHaveTextContent('Monday');
    expect(badges[1]).toHaveTextContent('Wednesday');
  });
});
