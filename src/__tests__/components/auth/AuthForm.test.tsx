/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthForm from '@/components/auth/AuthForm';
import { z } from 'zod';

const mockHandleAuthSubmit = jest.fn();

const mockSignUpSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const mockSignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

function mockUseAuthForm({ type = 'sign-up' }) {
  const isSignInForm = type === 'sign-in';
  return {
    isPending: false,
    buttonText: isSignInForm ? 'Sign In' : 'Sign Up',
    isSignInForm,
    handleAuthSubmit: mockHandleAuthSubmit,
    authSchema: isSignInForm ? mockSignInSchema : mockSignUpSchema,
  };
}

jest.mock('@/hooks/useAuthForm', () => ({
  __esModule: true,
  default: (type: 'sign-in' | 'sign-up') => mockUseAuthForm({ type }),
}));

describe('AuthFormSignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields and button', () => {
    render(<AuthForm type="sign-up" />);

    expect(screen.getByPlaceholderText(/enter your name/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your username/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your email/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your password/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it('calls handleAuthSubmit on form submit', async () => {
    render(<AuthForm type="sign-up" />);
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText(/enter your name/i),
      'John Doe',
    );
    await user.type(
      screen.getByPlaceholderText(/enter your username/i),
      'johndoe',
    );
    await user.type(
      screen.getByPlaceholderText(/enter your email/i),
      'john@example.com',
    );
    await user.type(
      screen.getByPlaceholderText(/enter your password/i),
      'Password123!',
    );

    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(mockHandleAuthSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'Password123!',
    });
  });
});

describe('AuthFormSignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields and button', () => {
    render(<AuthForm type="sign-in" />);
    expect(
      screen.getByPlaceholderText(/enter your email/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your password/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it('calls handleAuthSubmit on form submit', async () => {
    render(<AuthForm type="sign-in" />);
    const user = userEvent.setup();
    await user.type(
      screen.getByPlaceholderText(/enter your email/i),
      'john@example.com',
    );
    await user.type(
      screen.getByPlaceholderText(/enter your password/i),
      'Password123!',
    );

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockHandleAuthSubmit).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'Password123!',
    });
  });
});
