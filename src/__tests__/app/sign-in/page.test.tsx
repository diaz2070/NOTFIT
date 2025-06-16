/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import React from 'react';

import SignIn from '@/app/sign-in/page';

jest.mock('@/components/auth/AuthForm', () => {
  return function MockedAuthForm() {
    return <div data-testid="auth-form">Mocked AuthForm</div>;
  };
});

describe('SignIn Page', () => {
  it('renders title, description, and AuthForm with correct type', () => {
    render(<SignIn />);

    expect(screen.getAllByText(/Sign in/i)[0]).toBeInTheDocument();

    expect(
      screen.getByText(/enter your email below to sign in into your gym/i),
    ).toBeInTheDocument();

    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
  });
});
