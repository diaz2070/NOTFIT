'use server';

import { createClient, getUser } from '@/auth/server';
import { prisma } from '@/db/prisma';
import handleError from '@/utils/handle';
import { signUpSchema, signInSchema } from '@/utils/validators/authSchema';
import { changePasswordSchema } from '@/utils/validators/changePasswordSchema';
import {
  UserInfoFields,
  userInfoSchema,
} from '@/utils/validators/userInfoSchema';
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

export const changePasswordAction = async (
  email: string,
  values: z.infer<typeof changePasswordSchema>,
): Promise<{
  status: number;
  errorMessage: string | null;
}> => {
  const validation = changePasswordSchema.safeParse(values);
  if (!validation.success) {
    return {
      status: 400,
      errorMessage: `Invalid input: ${validation.error.message}`,
    };
  }

  try {
    const supabase = await createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: values.currentPassword,
    });

    if (signInError) {
      return {
        status: 401,
        errorMessage: 'Old password is incorrect.',
      };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: values.newPassword,
    });

    if (updateError) throw updateError;

    return { status: 200, errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const updateUserInfoAction = async (
  values: UserInfoFields,
): Promise<{
  status: number;
  errorMessage: string | null;
}> => {
  const validation = userInfoSchema.safeParse(values);
  if (!validation.success) {
    return {
      status: 400,
      errorMessage: `Invalid input: ${validation.error.message}`,
    };
  }

  try {
    const { auth } = await createClient();
    const user = await getUser();

    if (!user) {
      return {
        status: 401,
        errorMessage: 'User not authenticated',
      };
    }

    const { error: updateError } = await auth.updateUser({
      email: values.email,
      data: {
        username: values.username,
        fullName: values.name,
      },
    });

    if (updateError) throw updateError;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: values.email,
        username: values.username,
        fullName: values.name,
      },
    });

    return { status: 200, errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};
