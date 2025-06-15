import { render, screen } from '@testing-library/react';

import HistoryRoutePage, { metadata } from '@/app/history/page';

jest.mock('@/components/history/WorkoutHistory', () => {
  function MockedHistoryPage() {
    return <div data-testid="history-page">Mocked History Page</div>;
  }
  return MockedHistoryPage;
});

describe('HistoryRoutePage', () => {
  it('renders the history page component', () => {
    render(<HistoryRoutePage />);
    expect(screen.getByTestId('history-page')).toBeInTheDocument();
  });

  it('has correct metadata', () => {
    expect(metadata.title).toBe('Workout History');
    expect(metadata.description).toBe('Check your workout history');
  });
});
