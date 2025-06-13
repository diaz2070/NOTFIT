import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

// Mock de subcomponentes
jest.mock('@/components/Navigation/MobileNavigation', () => {
  return function MockMobileNavigation() {
    return <div data-testid="mobile-nav">MobileNavigation</div>;
  };
});
jest.mock('@/components/Navigation/DesktopNavigation', () => {
  return function MockDesktopNavigation() {
    return <div data-testid="desktop-nav">DesktopNavigation</div>;
  };
});

// Mock de getUser
jest.mock('@/auth/server', () => ({
  getUser: jest.fn().mockResolvedValue({
    id: 'user-1',
    user_metadata: { username: 'TestUser' },
  }),
}));

describe('<Header />', () => {
  it('renders logo and navigation components', async () => {
    render(await Header());

    const logoLight = screen.getAllByAltText('NOTFIT Logo')[0];
    const logoDark = screen.getAllByAltText('NOTFIT Logo')[1];

    expect(logoLight).toBeInTheDocument();
    expect(logoDark).toBeInTheDocument();

    expect(screen.getByTestId('mobile-nav')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-nav')).toBeInTheDocument();
  });
});
