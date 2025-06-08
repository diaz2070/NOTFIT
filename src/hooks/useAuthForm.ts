import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import signUpAction from '@/actions/user';
import authSchema from '@/utils/validators/authSchema';
import { z } from 'zod';

export default function useAuthForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const buttonText = 'Sign Up';

  const handleAuthSubmit = (values: z.infer<typeof authSchema>) => {
    startTransition(async () => {
      let title = '';
      let description = '';

      // Sign up the user and handle the response from the action
      const response = await signUpAction(values);
      // Set title and description based on success or error
      title = 'Welcome to the gym! Let’s get started.';
      description = 'Check your email for a verification link.';

      if (response.status === 200) {
        toast.success(title, { description, duration: 6000 });
        router.replace('/');
      } else {
        toast.error('Something went wrong', {
          description: response.errorMessage ?? 'Please try again later.',
          duration: 6000,
        });
      }
    });
  };

  return {
    isPending,
    handleAuthSubmit,
    buttonText,
  };
}
