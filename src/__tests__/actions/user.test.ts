/**
 * @jest-environment node
 */
import { SupabaseClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

import { prisma } from '@/db/prisma';

import type { z } from 'zod';

import { createClient } from '@/auth/server';
import { signUpAction, signInAction, logoutAction } from '@/actions/user';
import { signUpSchema, signInSchema } from '@/utils/validators/authSchema';
import handleError from '@/utils/handle';

type SignUpSchemaType = z.infer<typeof signUpSchema>;
type SignInSchemaType = z.infer<typeof signInSchema>;

// Mock dependencies
jest.mock('@/auth/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('@/db/prisma', () => ({
  prisma: {
    user: {
      create: jest.fn(),
    },
  },
}));

jest.mock('@/utils/handle');

// Type the mock functions properly
const mockedCreateClient = jest.mocked(createClient);
const mockedHandleError = jest.mocked(handleError);
const mockedPrisma = prisma as unknown as {
  user: {
    create: jest.Mock;
  };
};

describe('signUpAction', () => {
  const validValues: SignUpSchemaType = {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    password: 'Password123!',
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('returns 400 for invalid input', async () => {
    const invalid = { ...validValues, email: 'invalid' };
    const res = await signUpAction(invalid as SignUpSchemaType);
    expect(res.status).toBe(400);
    expect(res.errorMessage).toContain('email');
  });

  it('returns 500 if Supabase signUp returns error', async () => {
    const mockAuth = {
      signUp: jest.fn().mockResolvedValue({
        data: {},
        error: new Error('Supabase failed'),
      }),
    };

    mockedCreateClient.mockResolvedValue({
      auth: mockAuth,
      // Add minimal required properties to satisfy the type
      supabaseUrl: 'http://example.com',
      supabaseKey: 'fake-key',
      // Other required properties...
    } as unknown as SupabaseClient);

    mockedHandleError.mockReturnValue({
      status: 500,
      errorMessage: 'Supabase failed',
    });

    const res = await signUpAction(validValues);
    expect(mockAuth.signUp).toHaveBeenCalled();
    expect(res.status).toBe(500);
    expect(res.errorMessage).toBe('Supabase failed');
  });

  it('returns 500 if Supabase user is null', async () => {
    const mockAuth = {
      signUp: jest.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      }),
    };

    mockedCreateClient.mockResolvedValue({
      auth: mockAuth,
      // Add minimal required properties to satisfy the type
      supabaseUrl: 'http://example.com',
      supabaseKey: 'fake-key',
      // Other required properties...
    } as unknown as SupabaseClient);

    mockedHandleError.mockReturnValue({
      status: 500,
      errorMessage: 'User ID is missing',
    });

    const res = await signUpAction(validValues);
    expect(res.status).toBe(500);
    expect(res.errorMessage).toBe('User ID is missing');
  });

  it('returns 500 if DB create fails', async () => {
    const mockAuth = {
      signUp: jest.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } as User },
        error: null,
      }),
    };

    mockedCreateClient.mockResolvedValue({
      auth: mockAuth,
      // Add minimal required properties to satisfy the type
      supabaseUrl: 'http://example.com',
      supabaseKey: 'fake-key',
      // Other required properties...
    } as unknown as SupabaseClient);

    mockedPrisma.user.create.mockRejectedValue(new Error('DB error'));

    mockedHandleError.mockReturnValue({
      status: 500,
      errorMessage: 'DB error',
    });

    const res = await signUpAction(validValues);
    expect(res.status).toBe(500);
    expect(res.errorMessage).toBe('DB error');
  });

  it('returns 200 on success', async () => {
    const mockAuth = {
      signUp: jest.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } as User },
        error: null,
      }),
    };

    mockedCreateClient.mockResolvedValue({
      auth: mockAuth,
      // Add minimal required properties to satisfy the type
      supabaseUrl: 'http://example.com',
      supabaseKey: 'fake-key',
      // Other required properties...
    } as unknown as SupabaseClient);

    mockedPrisma.user.create.mockResolvedValue({
      id: 'user-123',
      email: validValues.email,
      username: validValues.username,
      fullName: validValues.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await signUpAction(validValues);
    expect(res.status).toBe(201);
    expect(res.errorMessage).toBeNull();
  });
});

describe('signInAction', () => {
  const validCredentials: SignInSchemaType = {
    email: 'john@example.com',
    password: 'Password123!',
  };

  it('returns 400 for invalid input', async () => {
    const invalid = { ...validCredentials, email: 'not-an-email' };
    const res = await signInAction(invalid as SignInSchemaType);
    expect(res.status).toBe(400);
    expect(res.errorMessage).toContain('email');
  });

  it('returns 500 if Supabase signInWithPassword throws error', async () => {
    const mockAuth = {
      signInWithPassword: jest.fn().mockResolvedValue({
        error: new Error('Invalid credentials'),
      }),
    };

    mockedCreateClient.mockResolvedValue({
      auth: mockAuth,
    } as unknown as SupabaseClient);

    mockedHandleError.mockReturnValue({
      status: 500,
      errorMessage: 'Invalid credentials',
    });

    const res = await signInAction(validCredentials);
    expect(mockAuth.signInWithPassword).toHaveBeenCalledWith(validCredentials);
    expect(res.status).toBe(500);
    expect(res.errorMessage).toBe('Invalid credentials');
  });

  it('returns 201 on successful login', async () => {
    const mockAuth = {
      signInWithPassword: jest.fn().mockResolvedValue({
        error: null,
      }),
    };

    mockedCreateClient.mockResolvedValue({
      auth: mockAuth,
    } as unknown as SupabaseClient);

    const res = await signInAction(validCredentials);
    expect(mockAuth.signInWithPassword).toHaveBeenCalledWith(validCredentials);
    expect(res.status).toBe(201);
    expect(res.errorMessage).toBeNull();
  });
});

describe('logoutAction', () => {
  it('returns null errorMessage on success', async () => {
    const mockAuth = {
      signOut: jest.fn().mockResolvedValue({ error: null }),
    };

    mockedCreateClient.mockResolvedValue({
      auth: mockAuth,
    } as unknown as SupabaseClient);

    const res = await logoutAction();
    expect(mockAuth.signOut).toHaveBeenCalled();
    expect(res.errorMessage).toBeNull();
  });

  it('returns errorMessage on failure', async () => {
    const mockAuth = {
      signOut: jest
        .fn()
        .mockResolvedValue({ error: new Error('Logout failed') }),
    };

    mockedCreateClient.mockResolvedValue({
      auth: mockAuth,
    } as unknown as SupabaseClient);

    mockedHandleError.mockReturnValue({
      status: 500,
      errorMessage: 'Logout failed',
    });

    const res = await logoutAction();
    expect(mockAuth.signOut).toHaveBeenCalled();
    expect(res.errorMessage).toBe('Logout failed');
  });
});
