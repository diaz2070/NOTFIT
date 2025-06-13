import React from 'react';
import { render, screen } from '@testing-library/react';
import DesktopNavigation from '@/components/Navigation/DesktopNavigation';
import { User } from '@supabase/supabase-js';

jest.mock('@/components/Navigation/ButtonNavigation', () => {
  return function ButtonNavigation() {
    return <div data-testid="button-navigation">ButtonNavigation</div>;
  };
});
jest.mock('@/components/Navigation/UserNavigationButtons', () => {
  return function UserNavigationButtons() {
    return <div data-testid="user-nav-buttons">UserNavigationButtons</div>;
  };
});
jest.mock('@/components/Navigation/DarkModeToggle', () => {
  return function DarkModeToggle() {
    return <div data-testid="dark-toggle">DarkModeToggle</div>;
  };
});
jest.mock('@/components/Navigation/LogoutButton', () => {
  return function LogoutButton() {
    return <div data-testid="logout-button">LogoutButton</div>;
  };
});

describe('<DesktopNavigation />', () => {
  it('renders navigation for authenticated user', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      user_metadata: { username: 'TestUser' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: '',
    } as User;

    render(<DesktopNavigation user={mockUser} />);

    expect(screen.getByTestId('button-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    expect(screen.getByTestId('dark-toggle')).toBeInTheDocument();
    expect(screen.queryByTestId('user-nav-buttons')).not.toBeInTheDocument();
  });

  it('renders navigation for guest user', () => {
    render(<DesktopNavigation user={null} />);

    expect(screen.getByTestId('user-nav-buttons')).toBeInTheDocument();
    expect(screen.getByTestId('dark-toggle')).toBeInTheDocument();
    expect(screen.queryByTestId('button-navigation')).not.toBeInTheDocument();
    expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
  });
});
