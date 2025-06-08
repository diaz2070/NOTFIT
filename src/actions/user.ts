'use server';

import { createClient } from '@/auth/server';
import { prisma } from '@/db/prisma';
import handleError from '@/utils/handle';
import authSchema from '@/utils/validators/authSchema';
import { z } from 'zod';

type SignUpResult = {
  status: number;
  errorMessage: string | null;
};

const signUpAction = async (
  values: z.infer<typeof authSchema>,
): Promise<SignUpResult> => {
  const validation = authSchema.safeParse(values);
  if (!validation.success) {
    return {
      status: 400,
      errorMessage: validation.error.message,
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
      status: 200,
      errorMessage: null,
    };
  } catch (error) {
    return handleError(error);
  }
};

export default signUpAction;
