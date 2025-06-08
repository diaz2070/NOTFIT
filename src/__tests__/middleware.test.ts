/**
 * @jest-environment node
 */

import { NextResponse } from 'next/server';
import { updateSession, middleware } from '../middleware';

jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server');
  return {
    ...actual,
    NextResponse: {
      next: jest.fn(() => ({
        headers: {
          get: (key: string) => (key === 'x-middleware-next' ? '1' : null),
        },
      })),
      redirect: jest.fn(),
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
});
