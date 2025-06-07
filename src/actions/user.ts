'use server';

import { createClient } from '@/auth/server';
import { prisma } from '@/db/prisma';
import { handleError } from '@/lib/utils';

const signUpAction = async (
  email: string,
  password: string,
  username: string,
  fullName: string,
): Promise<{ errorMessage: string | null }> => {
  try {
    const { auth } = await createClient();
    const { data, error } = await auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          fullName,
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
        email,
        username,
        fullName,
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export default signUpAction;
