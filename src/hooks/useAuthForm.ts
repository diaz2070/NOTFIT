// filepath: c:\Users\andre\Documents\2025-ii\Calidad\Proyecto\NOTFIT\src\hooks\useAuthForm.ts
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { signUpAction, signInAction } from '@/actions/user';
import { signUpSchema, signInSchema } from '@/utils/validators/authSchema';
import { z } from 'zod';

type SignUpData = z.infer<typeof signUpSchema>;
type SignInData = z.infer<typeof signInSchema>;

export default function useAuthForm(type: 'sign-in' | 'sign-up') {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isSignInForm = type === 'sign-in';
  const buttonText = isSignInForm ? 'Sign In' : 'Sign Up';
  const schema = type === 'sign-up' ? signUpSchema : signInSchema;

  const handleAuthSubmit = (values: SignUpData | SignInData) => {
    startTransition(async () => {
      let title = '';
      let description = '';
      let response: { status: number; errorMessage: string | null };

      if (isSignInForm) {
        response = await signInAction(values as SignInData);
        title = 'Welcome back!';
        description = 'Get those gains back up.';
      } else {
        response = await signUpAction(values as SignUpData);
        title = 'Welcome to your gym hub!';
        description = 'Check your email for a verification link.';
      }

      if (response.status === 200 || response.status === 201) {
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
    isSignInForm,
    isPending,
    handleAuthSubmit,
    buttonText,
    authSchema: schema,
  };
}
