/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LogoutButton from '@/components/Navigation/LogoutButton';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { logoutAction } from '@/actions/user';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/actions/user', () => ({
  logoutAction: jest.fn(),
}));

describe('LogoutButton', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('calls logoutAction and redirects on success', async () => {
    (logoutAction as jest.Mock).mockResolvedValue({ errorMessage: null });

    render(<LogoutButton />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /log out/i }));

    expect(logoutAction).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Logout Successful');
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('shows error toast if logout fails', async () => {
    (logoutAction as jest.Mock).mockResolvedValue({
      errorMessage: 'Something went wrong',
    });

    render(<LogoutButton />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /log out/i }));

    expect(logoutAction).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Logout Failed:', {
      description: 'Something went wrong',
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('disables button and shows spinner during loading', async () => {
    let resolveLogout: (value: {
      errorMessage: string | null;
    }) => void = () => {};
    (logoutAction as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLogout = resolve;
        }),
    );

    render(<LogoutButton />);
    const user = userEvent.setup();

    const button = screen.getByRole('button', { name: /log out/i });
    await user.click(button);

    expect(button).toBeDisabled();
    expect(screen.getByRole('button')).toContainElement(
      screen.getByTestId('loader-icon'),
    );

    await act(async () => {
      resolveLogout({ errorMessage: null });
    });
  });
});
