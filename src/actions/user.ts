'use server';

import { createClient } from '@/auth/server';
import { prisma } from '@/db/prisma';
import handleError from '@/utils/handle';
import { signUpSchema, signInSchema } from '@/utils/validators/authSchema';
import { z } from 'zod';

type SignUpResult = {
  status: number;
  errorMessage: string | null;
};

export const signUpAction = async (
  values: z.infer<typeof signUpSchema>,
): Promise<SignUpResult> => {
  const validation = signUpSchema.safeParse(values);
  if (!validation.success) {
    return {
      status: 400,
      errorMessage: `Invalid input: ${validation.error.message}`,
    };
  }

  try {
    const { auth } = await createClient();
    const { data, error } = await auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          username: values.username,
          fullName: values.name,
        },
      },
    });
    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error('Error signing up: User ID is missing');

    // Add user to the database
    await prisma.user.create({
      data: {
        id: userId,
        email: values.email,
        username: values.username,
        fullName: values.name,
      },
    });
    return {
      status: 201,
      errorMessage: null,
    };
  } catch (error) {
    return handleError(error);
  }
};

export const signInAction = async (
  values: z.infer<typeof signInSchema>,
): Promise<SignUpResult> => {
  const validation = signInSchema.safeParse(values);
  if (!validation.success) {
    return {
      status: 400,
      errorMessage: `Invalid input: ${validation.error.message}`,
    };
  }

  try {
    const { auth } = await createClient();
    const { error } = await auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) throw error;

    return { status: 201, errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const logoutAction = async (): Promise<{
  errorMessage: string | null;
}> => {
  try {
    const { auth } = await createClient();
    const { error } = await auth.signOut();
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};
