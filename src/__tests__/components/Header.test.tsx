/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@/components/Header';
import { getUser } from '@/auth/server';

// Mocks
jest.mock('next/image', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function NextImageMock({
    alt = '',
    ...props
  }: Readonly<
    React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }
  >) {
    const rest = { ...props };
    delete rest.priority;
    return <img {...rest} alt={alt} />;
  }
  return NextImageMock;
});
jest.mock('next/link', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function LinkMock({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});
jest.mock('@/styles/utils', () => 'none');
jest.mock('@/auth/server', () => ({
  getUser: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe('Header Component', () => {
  it('renders sign-in and sign-up buttons when user is not authenticated', async () => {
    (getUser as jest.Mock).mockResolvedValueOnce(null);

    render(await Header());

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
  it('renders welcome message and logout button when user is authenticated', async () => {
    (getUser as jest.Mock).mockResolvedValueOnce({
      user_metadata: { username: 'testuser' },
    });

    render(await Header());

    expect(screen.getByText(/Welcome back testuser/i)).toBeInTheDocument();
    expect(screen.getByText('Log Out')).toBeInTheDocument();
  });
});
