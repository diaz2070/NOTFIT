import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileNavigation from '@/components/Navigation/MobileNavigation';
import { User } from '@supabase/supabase-js';

jest.mock('@/components/Navigation/ButtonNavigation', () => {
  return function MockButtonNavigation() {
    return <div data-testid="button-navigation">ButtonNavigation</div>;
  };
});
jest.mock('@/components/Navigation/UserNavigationButtons', () => {
  return function MockUserNavigationButtons() {
    return <div data-testid="user-nav-buttons">UserNavigationButtons</div>;
  };
});
jest.mock('@/components/Navigation/DarkModeToggle', () => {
  return function MockDarkModeToggle() {
    return <div data-testid="dark-toggle">DarkModeToggle</div>;
  };
});

jest.mock('@/components/Navigation/LogoutButton', () => {
  return function MockLogoutButton() {
    return <div data-testid="logout-button">LogoutButton</div>;
  };
});

describe('<MobileNavigation />', () => {
  it('renders properly for authenticated user', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      user_metadata: { username: 'TestUser' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: '',
    } as User;

    render(<MobileNavigation user={mockUser} />);
    const menuButton = screen.getByRole('button');

    fireEvent.click(menuButton);

    expect(screen.getByTestId('button-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('dark-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    expect(screen.queryByTestId('user-nav-buttons')).not.toBeInTheDocument();
  });

  it('renders properly for guest user', () => {
    render(<MobileNavigation user={null} />);
    const menuButton = screen.getByRole('button');

    fireEvent.click(menuButton);

    expect(screen.getByTestId('user-nav-buttons')).toBeInTheDocument();
    expect(screen.getByTestId('dark-toggle')).toBeInTheDocument();
    expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('button-navigation')).not.toBeInTheDocument();
  });
});
