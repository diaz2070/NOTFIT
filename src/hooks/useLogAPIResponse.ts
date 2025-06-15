'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { ApiResponse } from '@/actions/workoutLog';

type ServerAction<TArgs extends unknown[], TResult> = (
  ...args: TArgs
) => Promise<ApiResponse<TResult>>;

export default function useLogResponse<TArgs extends unknown[], TResult>(
  action: ServerAction<TArgs, TResult>,
  messages?: {
    success?: string;
    error?: string;
  },
) {
  const [isPending, startTransition] = useTransition();

  const wrapped = (...args: TArgs): Promise<ApiResponse<TResult>> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        const res = await action(...args);

        if (res.status >= 200 && res.status < 300) {
          toast.success(messages?.success ?? 'Success', {
            duration: 6000,
          });
        } else {
          toast.error('Error', {
            description: res.errorMessage ?? 'Something went wrong',
            duration: 6000,
          });
        }

        resolve(res);
      });
    });
  };

  return {
    isPending,
    mutate: wrapped,
  };
}
