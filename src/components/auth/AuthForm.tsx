'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Loader2 } from 'lucide-react';
import useAuthForm from '@/hooks/useAuthForm';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SignInFormFields,
  SignUpFormFields,
} from '@/utils/validators/authSchema';

import { Button } from '../ui/button';
import { CardContent, CardFooter } from '../ui/card';
import InputField from './InputField';
import { Form } from '../ui/form';

type AuthFormProps = Readonly<{
  type?: 'sign-in' | 'sign-up';
}>;

export default function AuthForm({ type = 'sign-up' }: AuthFormProps) {
  const { isSignInForm, isPending, handleAuthSubmit, buttonText, authSchema } =
    useAuthForm(type);

  const form = useForm<SignUpFormFields | SignInFormFields>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(type === 'sign-up' && { name: '', username: '' }),
    },
  });

  function onSubmit(values: z.infer<typeof authSchema>) {
    handleAuthSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="grid w-full items-center gap-6">
          {!isSignInForm && (
            <>
              <InputField
                control={form.control}
                id="name"
                label="Name"
                name="name"
                type="text"
                placeholder="Enter your name"
                required
                disabled={isPending}
              />
              <InputField
                control={form.control}
                id="username"
                label="Username"
                name="username"
                type="text"
                placeholder="Enter your username"
                required
                disabled={isPending}
              />
            </>
          )}
          <InputField
            control={form.control}
            id="email"
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            disabled={isPending}
          />
          <InputField
            control={form.control}
            id="password"
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            disabled={isPending}
          />
        </CardContent>
        <CardFooter className="mt-6 flex flex-col gap-6">
          <Button className="w-full text-white" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : buttonText}
          </Button>
          <p className="text-sm">
            {isSignInForm
              ? 'Don’t have an account? '
              : 'Already have an account? '}
            <Link
              href={isSignInForm ? '/sign-up' : '/sign-in'}
              className={`underline ${isPending ? 'pointer-events-none opacity-50' : ''}`}
            >
              {isSignInForm ? 'Sign Up' : 'Sign In'}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Form>
  );
}
