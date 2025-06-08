/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import AuthForm from '@/components/auth/AuthForm';

const mockHandleAuthSubmit = jest.fn();

jest.mock('@/hooks/useAuthForm', () => () => ({
  isPending: false,
  buttonText: 'Sign Up',
  handleAuthSubmit: mockHandleAuthSubmit,
}));

describe('AuthForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields and button', () => {
    render(<AuthForm />);

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
    render(<AuthForm />);
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
