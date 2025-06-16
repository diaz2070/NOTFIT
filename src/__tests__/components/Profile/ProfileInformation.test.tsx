import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileInformation from '@/components/Profile/ProfileInformation';
import { toast } from 'sonner';
import { updateUserInfoAction } from '@/actions/user';

jest.mock('@/actions/user', () => ({
  updateUserInfoAction: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('ProfileInformation', () => {
  const defaultProps = {
    name: 'Test User',
    email: 'test@example.com',
    username: 'test_user',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all input fields and button', () => {
    render(<ProfileInformation {...defaultProps} />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /save changes/i }),
    ).toBeInTheDocument();
  });

  it('submits form and shows success toast', async () => {
    (updateUserInfoAction as jest.Mock).mockResolvedValue({ status: 200 });

    render(<ProfileInformation {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Updated User' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'updated@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'updated_user' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(updateUserInfoAction).toHaveBeenCalledWith({
        name: 'Updated User',
        email: 'updated@example.com',
        username: 'updated_user',
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Profile updated successfully',
      );
    });
  });

  it('shows error toast on server error', async () => {
    (updateUserInfoAction as jest.Mock).mockResolvedValue({ status: 500 });

    render(<ProfileInformation {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update profile', {
        description: 'An unexpected error occurred',
      });
    });
  });

  it('shows fallback toast on request failure', async () => {
    (updateUserInfoAction as jest.Mock).mockRejectedValue(
      new Error('network error'),
    );

    render(<ProfileInformation {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Request failed', {
        description: 'Please try again later',
      });
    });
  });
});
