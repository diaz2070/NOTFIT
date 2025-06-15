import { render, screen, fireEvent } from '@testing-library/react';
import WorkoutProgressBar from '@/components/log/WorkoutProgressBar';

jest.useFakeTimers().setSystemTime(new Date('2023-01-01T10:00:00Z'));

describe('WorkoutProgressBar', () => {
  const mockOnPause = jest.fn();
  const mockOnResume = jest.fn();

  const baseProps = {
    startTime: new Date(Date.now() - 60 * 1000),
    totalCompletedSets: 2,
    totalSets: 5,
    pausedAt: null,
    onPause: mockOnPause,
    onResume: mockOnResume,
    isPausing: false,
    isResuming: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders progress text and timer', () => {
    render(<WorkoutProgressBar {...baseProps} status="IN_PROGRESS" />);

    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('2 of 5 sets completed')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('shows "Pause" button when in progress', () => {
    render(<WorkoutProgressBar {...baseProps} status="IN_PROGRESS" />);

    const pauseButton = screen.getByRole('button', { name: /pause/i });
    expect(pauseButton).toBeInTheDocument();

    fireEvent.click(pauseButton);
    expect(mockOnPause).toHaveBeenCalled();
  });

  it('shows "Resume" button when paused', () => {
    render(
      <WorkoutProgressBar
        {...baseProps}
        status="PAUSED"
        pausedAt={new Date()}
      />,
    );

    const resumeButton = screen.getByRole('button', { name: /resume/i });
    expect(resumeButton).toBeInTheDocument();

    fireEvent.click(resumeButton);
    expect(mockOnResume).toHaveBeenCalled();
  });

  it('displays updated elapsed time after interval', () => {
    const { getByTestId } = render(
      <WorkoutProgressBar {...baseProps} status="IN_PROGRESS" />,
    );

    const timerText = getByTestId('elapsed-time').textContent;
    expect(timerText).toMatch(/^0m 00s$/);
  });

  it('does not show pause/resume buttons if workout is completed', () => {
    render(<WorkoutProgressBar {...baseProps} status="COMPLETED" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});
