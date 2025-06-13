import React from 'react';
import { render, screen } from '@testing-library/react';
import ButtonNavigation from '@/components/Navigation/ButtonNavigation';
import '@testing-library/jest-dom';

// Mock de usePathname
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const { usePathname: mockedUsePathname } = jest.requireMock('next/navigation');

describe('<ButtonNavigation />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all navigation links', () => {
    mockedUsePathname.mockReturnValue('/');

    render(<ButtonNavigation />);

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /routines/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /log/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /history/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
  });

  it('applies "default" variant for active path', () => {
    mockedUsePathname.mockReturnValue('/history');

    render(<ButtonNavigation />);

    const activeLink = screen.getByRole('link', { name: /history/i });
    expect(activeLink).toHaveClass('text-white');
  });

  it('applies "ghost" variant for inactive paths', () => {
    mockedUsePathname.mockReturnValue('/profile');

    render(<ButtonNavigation />);

    const inactiveLink = screen.getByRole('link', { name: /home/i });
    expect(inactiveLink).not.toHaveClass('text-white');
  });
});
