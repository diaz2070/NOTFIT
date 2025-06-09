/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useAuthForm from '@/hooks/useAuthForm';
import { signUpAction, signInAction } from '@/actions/user';

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
  signUpAction: jest.fn(),
  signInAction: jest.fn(),
}));

describe('useAuthForm', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
  });

  const signUpInput = {
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    password: 'StrongPass123!',
  };

  const signInInput = {
    email: 'test@example.com',
    password: 'StrongPass123!',
  };

  // ✅ Already covered
  it('handles successful signup', async () => {
    (signUpAction as jest.Mock).mockResolvedValue({
      status: 200,
      errorMessage: null,
    });

    const { result } = renderHook(() => useAuthForm('sign-up'));

    await act(async () => {
      result.current.handleAuthSubmit(signUpInput);
    });

    expect(signUpAction).toHaveBeenCalledWith(signUpInput);
    expect(toast.success).toHaveBeenCalledWith(
      'Welcome to your gym hub!',
      expect.objectContaining({
        description: 'Check your email for a verification link.',
        duration: 6000,
      }),
    );
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  // ✅ Already covered
  it('handles failed signup', async () => {
    (signUpAction as jest.Mock).mockResolvedValue({
      status: 400,
      errorMessage: 'Validation failed',
    });

    const { result } = renderHook(() => useAuthForm('sign-up'));

    await act(async () => {
      result.current.handleAuthSubmit(signUpInput);
    });

    expect(signUpAction).toHaveBeenCalledWith(signUpInput);
    expect(toast.error).toHaveBeenCalledWith(
      'Something went wrong',
      expect.objectContaining({
        description: 'Validation failed',
        duration: 6000,
      }),
    );
    expect(mockReplace).not.toHaveBeenCalled();
  });

  // ✅ New test: successful sign-in
  it('handles successful sign-in', async () => {
    (signInAction as jest.Mock).mockResolvedValue({
      status: 200,
      errorMessage: null,
    });

    const { result } = renderHook(() => useAuthForm('sign-in'));

    await act(async () => {
      result.current.handleAuthSubmit(signInInput);
    });

    expect(signInAction).toHaveBeenCalledWith(signInInput);
    expect(toast.success).toHaveBeenCalledWith(
      'Welcome back!',
      expect.objectContaining({
        description: 'Get those gains back up.',
        duration: 6000,
      }),
    );
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  // ✅ New test: failed sign-in with fallback message
  it('handles failed sign-in with fallback error message', async () => {
    (signInAction as jest.Mock).mockResolvedValue({
      status: 401,
      errorMessage: null, // triggers fallback string
    });

    const { result } = renderHook(() => useAuthForm('sign-in'));

    await act(async () => {
      result.current.handleAuthSubmit(signInInput);
    });

    expect(signInAction).toHaveBeenCalledWith(signInInput);
    expect(toast.error).toHaveBeenCalledWith(
      'Something went wrong',
      expect.objectContaining({
        description: 'Please try again later.',
        duration: 6000,
      }),
    );
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
