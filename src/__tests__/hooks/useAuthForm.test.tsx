/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useAuthForm from '@/hooks/useAuthForm';
import signUpAction from '@/actions/user';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/actions/user', () => jest.fn());

describe('useAuthForm', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
  });

  const validInput = {
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    password: 'StrongPass123!',
  };

  it('handles successful signup', async () => {
    (signUpAction as jest.Mock).mockResolvedValue({
      status: 200,
      errorMessage: null,
    });

    const { result } = renderHook(() => useAuthForm());

    await act(async () => {
      result.current.handleAuthSubmit(validInput);
    });

    expect(signUpAction).toHaveBeenCalledWith(validInput);
    expect(toast.success).toHaveBeenCalledWith(
      'Welcome to the gym! Let’s get started.',
      expect.objectContaining({
        description: 'Check your email for a verification link.',
        duration: 6000,
      }),
    );
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('handles failed signup', async () => {
    (signUpAction as jest.Mock).mockResolvedValue({
      status: 400,
      errorMessage: 'Validation failed',
    });

    const { result } = renderHook(() => useAuthForm());

    await act(async () => {
      result.current.handleAuthSubmit(validInput);
    });

    expect(signUpAction).toHaveBeenCalledWith(validInput);
    expect(toast.error).toHaveBeenCalledWith(
      'Something went wrong',
      expect.objectContaining({
        description: 'Validation failed',
        duration: 6000,
      }),
    );
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
