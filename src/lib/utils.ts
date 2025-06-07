import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown): { errorMessage: string } => {
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred';
  return { errorMessage: message };
};
