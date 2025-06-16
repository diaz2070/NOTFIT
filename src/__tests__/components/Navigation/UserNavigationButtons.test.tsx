import React from 'react';
import { render, screen } from '@testing-library/react';
import UserNavigationButtons from '@/components/Navigation/UserNavigationButtons';
import '@testing-library/jest-dom';

describe('<UserNavigationButtons />', () => {
  it('renders Sign In and Sign Up links', () => {
    render(<UserNavigationButtons />);

    const signInLink = screen.getByRole('link', { name: /sign in/i });
    const signUpLink = screen.getByRole('link', { name: /sign up/i });

    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/sign-in');

    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', '/sign-up');
  });
});
