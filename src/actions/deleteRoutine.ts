'use server';

import { prisma } from '@/db/prisma';
import handleError from '@/utils/handle';

type DeleteRoutineResult = {
  status: number;
  success: boolean;
  errorMessage: string | null;
};

const deleteRoutineAction = async (
  routineId: string,
  userId: string,
): Promise<DeleteRoutineResult> => {
  try {
    if (!userId || !routineId) {
      return {
        status: 400,
        success: false,
        errorMessage: 'Missing parameters',
      };
    }

    await prisma.routine.delete({
      where: {
        id: routineId,
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

export default deleteRoutineAction;
