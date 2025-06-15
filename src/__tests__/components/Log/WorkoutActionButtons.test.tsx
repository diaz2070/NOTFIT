import { render, screen, fireEvent } from '@testing-library/react';
import WorkoutActionButtons from '@/components/log/WorkoutActionButtons';

describe('WorkoutActionButtons', () => {
  const baseProps = {
    isBusy: false,
    isSaving: false,
    isDeleting: false,
    isDiscarding: false,
    onChangeRoutine: jest.fn(),
    onDiscard: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all three buttons', () => {
    render(<WorkoutActionButtons {...baseProps} />);
    expect(screen.getByText('Finish Workout')).toBeInTheDocument();
    expect(screen.getByText('Change Routine')).toBeInTheDocument();
    expect(screen.getByText('Discard')).toBeInTheDocument();
  });

  it('disables all buttons when isBusy is true', () => {
    render(<WorkoutActionButtons {...baseProps} isBusy />);
    expect(screen.getByText('Finish Workout')).toBeDisabled();
    expect(screen.getByText('Change Routine')).toBeDisabled();
    expect(screen.getByText('Discard')).toBeDisabled();
  });

  it('shows spinner when isSaving is true', () => {
    render(<WorkoutActionButtons {...baseProps} isSaving />);
    expect(screen.getAllByTestId('spinner')).toHaveLength(1);
  });

  it('shows spinner when isDeleting is true', () => {
    render(<WorkoutActionButtons {...baseProps} isDeleting />);
    expect(screen.getAllByTestId('spinner')).toHaveLength(1);
  });

  it('shows spinner when isDiscarding is true', () => {
    render(<WorkoutActionButtons {...baseProps} isDiscarding />);
    expect(screen.getAllByTestId('spinner')).toHaveLength(1);
  });

  it('calls onChangeRoutine when Change Routine button is clicked', () => {
    render(<WorkoutActionButtons {...baseProps} />);
    fireEvent.click(screen.getByText('Change Routine'));
    expect(baseProps.onChangeRoutine).toHaveBeenCalled();
  });

  it('calls onDiscard when Discard button is clicked', () => {
    render(<WorkoutActionButtons {...baseProps} />);
    fireEvent.click(screen.getByText('Discard'));
    expect(baseProps.onDiscard).toHaveBeenCalled();
  });
});
