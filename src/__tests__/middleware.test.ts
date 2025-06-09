/**
 * @jest-environment node
 */
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { updateSession, middleware } from '../middleware';

beforeAll(() => {
  process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
});

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    auth: {
      getUser: jest
        .fn()
        .mockResolvedValue({ data: { user: null }, error: null }),
    },
  })),
}));

jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server');
  const mockedResponse = {
    headers: {
      get: (key: string) => (key === 'x-middleware-next' ? '1' : null),
    },
    cookies: {
      set: jest.fn(),
    },
  };
  return {
    ...actual,
    NextResponse: {
      next: jest.fn(() => mockedResponse),
      redirect: jest.fn(() => mockedResponse),
    },
  };
});

describe('middleware', () => {
  const createMockRequest = (url: string) => ({
    nextUrl: new URL(url, 'http://localhost'),
    cookies: {
      getAll: jest.fn().mockReturnValue([]),
      set: jest.fn(),
    },
  });

  it('calls updateSession and returns NextResponse.next()', async () => {
    const request = createMockRequest(
      '/dashboard',
    ) as unknown as import('next/server').NextRequest;
    const response = await middleware(request);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(response.headers.get('x-middleware-next')).toBe('1');
  });

  it('returns NextResponse.next() for public routes', async () => {
    const request = createMockRequest(
      '/',
    ) as unknown as import('next/server').NextRequest;
    const response = await updateSession(request);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(response.headers.get('x-middleware-next')).toBe('1');
  });

  it('redirects authenticated user away from auth routes', async () => {
    // Mock user as authenticated
    const mockUser = { id: 'user123', email: 'user@example.com' };
    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    });
    const request = {
      nextUrl: new URL('/sign-in', 'http://localhost'),
      cookies: {
        getAll: jest.fn().mockReturnValue([]),
        set: jest.fn(),
      },
    } as unknown as import('next/server').NextRequest;

    await middleware(request);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL('/', process.env.NEXT_PUBLIC_BASE_URL),
    );
  });

  it('calls request.cookies.getAll and sets cookies using setAll', async () => {
    const mockSet = jest.fn();
    const mockGetAll = jest.fn().mockReturnValue([]);

    const request = {
      nextUrl: new URL('/', 'http://localhost'),
      cookies: {
        getAll: mockGetAll,
        set: mockSet,
      },
    } as unknown as import('next/server').NextRequest;

    (createServerClient as jest.Mock).mockImplementation((_url, _key, opts) => {
      opts.cookies.getAll();

      opts.cookies.setAll([
        { name: 'sb-access-token', value: 'abc123', options: { path: '/' } },
      ]);

      return {
        auth: {
          getUser: jest
            .fn()
            .mockResolvedValue({ data: { user: null }, error: null }),
        },
      };
    });

    const response = await middleware(request);

    // ✅ Verifica que se llamó getAll (lo que cubre cookies.getAll() → request.cookies.getAll())
    expect(mockGetAll).toHaveBeenCalled();

    // ✅ Verifica que se llamara cookies.set del request original
    expect(mockSet).toHaveBeenCalledWith('sb-access-token', 'abc123');

    // ✅ Verifica que se haya devuelto una respuesta con las cookies seteadas
    expect(NextResponse.next).toHaveBeenCalledWith({ request });
    expect(response.cookies.set).toHaveBeenCalledWith(
      'sb-access-token',
      'abc123',
      { path: '/' },
    );
  });
});
