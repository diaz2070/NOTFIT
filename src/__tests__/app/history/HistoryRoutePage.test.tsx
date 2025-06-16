import { render, screen } from '@testing-library/react';
import HistoryRoutePage, { metadata } from '@/app/history/page';

jest.mock('@/auth/server', () => ({
  getUser: jest.fn(() => Promise.resolve({ id: 'user-abc' })),
}));

jest.mock('@/components/history/WorkoutHistory', () => ({
  __esModule: true,
  default: ({ userId }: { userId: string }) => (
    <div data-testid="history-page">Mocked History Page for {userId}</div>
  ),
}));

describe('HistoryRoutePage', () => {
  it('renders the history page component', async () => {
    render(await HistoryRoutePage());
    expect(screen.getByTestId('history-page')).toBeInTheDocument();
    expect(screen.getByText(/user-abc/)).toBeInTheDocument();
  });

  it('has correct metadata', () => {
    expect(metadata.title).toBe('Workout History');
    expect(metadata.description).toBe('Check your workout history');
  });
});
