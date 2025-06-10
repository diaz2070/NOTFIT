import { GET } from '@/app/auth/confirm/route';
import { createClient } from '@/auth/server';
import { redirect } from 'next/navigation';

jest.mock('@/auth/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

const mockedCreateClient = createClient as jest.MockedFunction<
  typeof createClient
>;

describe('GET email confirmation handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (params: Record<string, string>) => {
    const url = new URL('http://localhost/auth/confirm');
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.set(key, value),
    );
    return {
      url: url.toString(),
      cookies: {
        get: jest.fn(),
        getAll: jest.fn(),
        set: jest.fn(),
        delete: jest.fn(),
      },
      nextUrl: url,
    } as unknown as import('next/server').NextRequest;
  };

  it('redirects to "/" when OTP is valid', async () => {
    mockedCreateClient.mockResolvedValue({
      auth: {
        verifyOtp: jest.fn().mockResolvedValue({ error: null }), // ✅ simulate success
      },
    } as unknown as import('@supabase/supabase-js').SupabaseClient);

    const request = createMockRequest({
      token_hash: 'abc123',
      type: 'email',
      next: '/',
    });

    await GET(request);

    expect(redirect).toHaveBeenCalledWith('/');
  });
  it('redirects to /error when OTP verification fails', async () => {
    mockedCreateClient.mockResolvedValue({
      auth: {
        verifyOtp: jest.fn().mockResolvedValue({ error: new Error('Invalid') }),
      },
    } as unknown as import('@supabase/supabase-js').SupabaseClient);

    const request = createMockRequest({
      token_hash: 'bad-token',
      type: 'email',
    });

    await GET(request);

    expect(redirect).toHaveBeenCalledWith('/error');
  });

  it('redirects to /error if missing query parameters', async () => {
    const request = createMockRequest({});

    await GET(request);

    expect(redirect).toHaveBeenCalledWith('/error');
  });
});
