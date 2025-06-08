import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { getUser } from '@/auth/server';
import type { User } from '@supabase/supabase-js';
import Header from '../../components/Header';

// User type mock
const mockUser: User = {
  id: '123',
  aud: 'authenticated',
  email: 'test@example.com',
  created_at: new Date().toISOString(),
  role: 'authenticated',
  app_metadata: {},
  user_metadata: {
    username: 'andres',
  },
  identities: [],
  last_sign_in_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  is_anonymous: false,
  invited_at: undefined,
  updated_at: new Date().toISOString(),
};

jest.mock('@/auth/server');
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    alt = 'mocked image',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    priority,
    ...props
  }: {
    alt?: string;
    priority?: boolean;
  } & React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img alt={alt} {...props} />;
  },
}));
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href}>{children}</a>
  ),
}));
jest.mock('../../components/DarkModeToggle', () => {
  return function DarkModeToggle() {
    return <div data-testid="darkmode-toggle" />;
  };
});
jest.mock('../../components/ui/button', () => ({
  Button: ({ children }: React.PropsWithChildren<unknown>) => (
    <div data-testid="button">{children}</div>
  ),
}));

const mockedGetUser = mocked(getUser);

describe('Header', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders username when user is logged in', async () => {
    mockedGetUser.mockResolvedValue({
      ...mockUser,
      user_metadata: { username: 'andres' },
    });

    render(await Header());

    expect(await screen.findByText(/Welcome back andres/i)).toBeInTheDocument();
    expect(screen.getByTestId('darkmode-toggle')).toBeInTheDocument();
  });

  it('renders sign-up button when user is not logged in', async () => {
    mockedGetUser.mockResolvedValue(null);

    render(await Header());

    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByTestId('darkmode-toggle')).toBeInTheDocument();
  });
});
