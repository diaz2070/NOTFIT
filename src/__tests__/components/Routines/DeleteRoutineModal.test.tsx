import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteRoutineModal from '@/components/routines/[id]/delete/DeleteRoutineModal';

describe('DeleteRoutineModal', () => {
  const routineMock = {
    id: 'abc123',
    name: 'Leg Day',
    days: ['Monday', 'Thursday'],
    exercises: 5,
    lastUsed: '2024-06-01',
  };

  it('renders when open', () => {
    render(
      <DeleteRoutineModal
        isOpen
        routine={routineMock}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('heading', { name: /Delete Routine/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('All data related to this routine will be lost.'),
    ).toBeInTheDocument();
  });

  it('displays routine name, exercises, and days', () => {
    render(
      <DeleteRoutineModal
        isOpen
        routine={routineMock}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(screen.getByText(/"Leg Day"/)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Monday, Thursday')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = jest.fn();

    render(
      <DeleteRoutineModal
        isOpen
        routine={routineMock}
        onConfirm={jest.fn()}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onConfirm when Delete button is clicked', () => {
    const onConfirm = jest.fn();

    render(
      <DeleteRoutineModal
        isOpen
        routine={routineMock}
        onConfirm={onConfirm}
        onCancel={jest.fn()}
      />,
    );

    const deleteButton = screen.getByRole('button', {
      name: /Delete Routine/i,
    });
    fireEvent.click(deleteButton);
    expect(onConfirm).toHaveBeenCalled();
  });

  it('does not render if isOpen is false', () => {
    render(
      <DeleteRoutineModal
        isOpen={false}
        routine={routineMock}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(
      screen.queryByRole('heading', { name: /Delete Routine/i }),
    ).not.toBeInTheDocument();
  });

  it('handles null routine gracefully', () => {
    render(
      <DeleteRoutineModal
        isOpen
        routine={null}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('heading', { name: /Delete Routine/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Exercises:/)).not.toBeInTheDocument();
  });

  it('calls onCancel when user presses Escape', async () => {
    const onCancel = jest.fn();

    render(
      <DeleteRoutineModal
        isOpen
        routine={routineMock}
        onConfirm={jest.fn()}
        onCancel={onCancel}
      />,
    );

    await userEvent.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalled();
  });
});
