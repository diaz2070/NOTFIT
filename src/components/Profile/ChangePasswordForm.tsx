'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  changePasswordSchema,
  ChangePasswordFields,
} from '@/utils/validators/changePasswordSchema';

import { toast } from 'sonner';
import { Lock, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import InputField from '@/components/auth/InputField';
import { useTransition } from 'react';
import { changePasswordAction } from '@/actions/user';

type Props = {
  email: string;
};

export default function ChangePasswordForm({ email }: Readonly<Props>) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChangePasswordFields>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ChangePasswordFields) => {
    startTransition(async () => {
      try {
        const response = await changePasswordAction(email, values);

        if (response.status === 200) {
          toast.success('Password changed successfully');
        } else {
          toast.error('Failed to change password', {
            description: 'An unexpected error occurred',
          });
        }
      } catch {
        toast.error('Request failed', {
          description: 'Please try again later',
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Change Password
        </CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <InputField
              control={form.control}
              id="currentPassword"
              name="currentPassword"
              label="Current Password"
              type="password"
              placeholder="Enter your current password"
              required
              disabled={isPending}
            />

            <InputField
              control={form.control}
              id="newPassword"
              name="newPassword"
              label="New Password"
              type="password"
              placeholder="Minimum 8 characters"
              required
              disabled={isPending}
            />

            <InputField
              control={form.control}
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="Repeat the new password"
              required
              disabled={isPending}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Change Password'
              )}
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
