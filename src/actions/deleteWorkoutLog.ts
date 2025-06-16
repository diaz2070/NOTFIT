'use server';

import { prisma } from '@/db/prisma';
import handleError from '@/utils/handle';

const deleteWorkoutLogAction = async (
  workoutId: string,
  userId: string,
): Promise<{
  status: number;
  success: boolean;
  errorMessage: string | null;
}> => {
  try {
    if (!workoutId || !userId) {
      return {
        status: 400,
        success: false,
        errorMessage: 'Missing parameters',
      };
    }

    await prisma.workoutLog.delete({
      where: {
        id: workoutId,
        userId,
      },
    });

    return {
      status: 200,
      success: true,
      errorMessage: null,
    };
  } catch (error) {
    const err = handleError(error);
    return {
      status: err.status,
      success: false,
      errorMessage: err.errorMessage,
    };
  }
};

export default deleteWorkoutLogAction;
