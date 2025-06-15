import { render, screen } from '@testing-library/react';
import PausedWarningCard from '@/components/log/PausedWarningCard';

describe('PausedWarningCard', () => {
  const pausedTime = new Date('2023-01-01T10:00:00');

  it('does not render when visible is false', () => {
    const { container } = render(
      <PausedWarningCard pausedAt={pausedTime} visible={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('does not render when isPausing is true', () => {
    const { container } = render(
      <PausedWarningCard pausedAt={pausedTime} visible isPausing />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('does not render when isResuming is true', () => {
    const { container } = render(
      <PausedWarningCard pausedAt={pausedTime} visible isResuming />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders warning with time when visible and not pausing/resuming', () => {
    render(<PausedWarningCard pausedAt={pausedTime} visible />);
    expect(
      screen.getByText(
        /Workout paused since .*\. You can close the site and come back later to continue\./,
      ),
    ).toBeInTheDocument();
  });

  it('handles null pausedAt gracefully', () => {
    render(<PausedWarningCard pausedAt={null} visible />);
    expect(
      screen.getByText(
        /Workout paused since.*You can close the site and come back later to continue\./,
      ),
    ).toBeInTheDocument();
  });
});
