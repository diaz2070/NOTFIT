/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AccountActions from '@/components/Profile/AccountActions';
import { logoutAction } from '@/actions/user';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

jest.mock('@/actions/user', () => ({
  logoutAction: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('AccountActions', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders logout UI', () => {
    render(<AccountActions />);
    expect(
      screen.getByRole('button', { name: /log out/i }),
    ).toBeInTheDocument();
  });

  it('calls logoutAction and shows success toast on success', async () => {
    (logoutAction as jest.Mock).mockResolvedValue({ errorMessage: null });

    render(<AccountActions />);

    fireEvent.click(screen.getByRole('button', { name: /log out/i }));

    await waitFor(() => {
      expect(logoutAction).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Logout Successful');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('calls logoutAction and shows error toast on failure', async () => {
    (logoutAction as jest.Mock).mockResolvedValue({
      errorMessage: 'Session error',
    });

    render(<AccountActions />);

    fireEvent.click(screen.getByRole('button', { name: /log out/i }));

    await waitFor(() => {
      expect(logoutAction).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Logout Failed:', {
        description: 'Session error',
      });
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('disables button while loading and shows loader', async () => {
    const mockLogout = jest.fn().mockResolvedValueOnce(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ errorMessage: null });
        }, 100);
      }),
    );

    (logoutAction as jest.Mock).mockImplementation(mockLogout);

    render(<AccountActions />);
    const button = screen.getByRole('button', { name: /log out/i });

    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
