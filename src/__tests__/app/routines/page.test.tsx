import { render, screen } from '@testing-library/react';
import Page from '@/app/routines/page';
import { getUser } from '@/auth/server';

jest.mock('@/auth/server', () => ({
  getUser: jest.fn(),
}));

jest.mock('@/components/routines/RoutinesPage', () => ({
  __esModule: true,
  default: ({ userId }: { userId: string }) => (
    <div data-testid="routines-page">User ID: {userId}</div>
  ),
}));

describe('<Page />', () => {
  it('renders RoutinesPage when user exists', async () => {
    (getUser as jest.Mock).mockResolvedValue({ id: '123' });
    render(await Page());

    expect(screen.getByTestId('routines-page')).toHaveTextContent(
      'User ID: 123',
    );
  });

  it('returns null when no user', async () => {
    (getUser as jest.Mock).mockResolvedValue(null);
    const result = await Page();

    expect(result).toBeNull();
  });
});
