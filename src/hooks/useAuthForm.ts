import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import signUpAction from '@/actions/user';

export default function useAuthForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const buttonText = 'Sign Up';

  const handleAuthSubmit = (formData: FormData) => {
    startTransition(async () => {
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      let errorMessage = null;
      let title = '';
      let description = '';

      const username = formData.get('username') as string;
      const fullName = formData.get('full-name') as string;
      if (!username || !fullName) {
        toast.error('Missing signup data');
        return;
      }
      errorMessage = (await signUpAction(email, password, username, fullName))
        .errorMessage;
      title = 'Account Created Successfully';
      description = 'Welcome to the gym! Let’s get started.';

      if (!errorMessage) {
        toast.success(title, { description, duration: 6000 });
        router.replace('/');
      } else {
        toast.error('Error', { description: errorMessage, duration: 6000 });
      }
    });
  };

  return {
    isPending,
    handleAuthSubmit,
    buttonText,
  };
}
