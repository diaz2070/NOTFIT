import { render, screen, fireEvent } from '@testing-library/react';
import DeleteWorkoutLogModal from '@/components/history/DeleteWorkoutLogModal';

describe('DeleteWorkoutLogModal', () => {
  const mockOnCancel = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    workoutId: '123',
    isOpen: true,
    onCancel: mockOnCancel,
    onConfirm: mockOnConfirm,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal when isOpen is true', () => {
    render(<DeleteWorkoutLogModal {...defaultProps} />);
    expect(
      screen.getByText(/Are you sure you want to delete this workout/i),
    ).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<DeleteWorkoutLogModal {...defaultProps} />);
    fireEvent.click(screen.getByText(/cancel/i));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('calls onConfirm when delete button is clicked', () => {
    render(<DeleteWorkoutLogModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
  });

  it('does not render when isOpen is false', () => {
    render(<DeleteWorkoutLogModal {...defaultProps} isOpen={false} />);
    expect(
      screen.queryByText(/Are you sure you want to delete this workout/i),
    ).not.toBeInTheDocument();
  });
});
