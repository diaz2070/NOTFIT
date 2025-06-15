/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChangePasswordForm from '@/components/Profile/ChangePasswordForm';
import { changePasswordAction } from '@/actions/user';
import { toast } from 'sonner';

jest.mock('@/actions/user', () => ({
  changePasswordAction: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('ChangePasswordForm', () => {
  const email = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields and submit button', () => {
    render(<ChangePasswordForm email={email} />);

    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/new password/i)).toHaveLength(2);
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /change password/i }),
    ).toBeInTheDocument();
  });

  it('shows success toast on valid password change', async () => {
    (changePasswordAction as jest.Mock).mockResolvedValue({ status: 200 });

    render(<ChangePasswordForm email={email} />);

    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: { value: 'OldPassword123!' },
    });
    fireEvent.change(screen.getAllByLabelText(/new password/i)[0], {
      target: { value: 'NewPassword123!' },
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: 'NewPassword123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(changePasswordAction).toHaveBeenCalledWith(email, {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Password changed successfully',
      );
    });
  });

  it('shows error toast if backend fails', async () => {
    (changePasswordAction as jest.Mock).mockResolvedValue({ status: 500 });

    render(<ChangePasswordForm email={email} />);

    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: { value: 'OldPassword123!' },
    });
    fireEvent.change(screen.getAllByLabelText(/new password/i)[0], {
      target: { value: 'NewPassword123!' },
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: 'NewPassword123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to change password', {
        description: 'An unexpected error occurred',
      });
    });
  });

  it('shows fallback toast if request throws', async () => {
    (changePasswordAction as jest.Mock).mockRejectedValue(new Error('network'));

    render(<ChangePasswordForm email={email} />);

    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: { value: 'OldPassword123!' },
    });
    fireEvent.change(screen.getAllByLabelText(/new password/i)[0], {
      target: { value: 'NewPassword123!' },
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: 'NewPassword123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Request failed', {
        description: 'Please try again later',
      });
    });
  });
});
