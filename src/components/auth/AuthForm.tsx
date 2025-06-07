'use client';

import Link from 'next/link';

import { Loader2 } from 'lucide-react';
import useAuthForm from '@/hooks/useAuthForm';

import { Button } from '../ui/button';
import { CardContent, CardFooter } from '../ui/card';
import InputField from './InputFIeld';

export default function AuthForm() {
  const { isPending, handleAuthSubmit, buttonText } = useAuthForm();

  return (
    <form action={handleAuthSubmit}>
      <CardContent className="grid w-full items-center gap-6">
        <>
          <InputField
            id="full-name"
            label="Full Name"
            name="full-name"
            type="text"
            placeholder="Enter your full name"
            required
            disabled={isPending}
          />
          <InputField
            id="username"
            label="Username"
            name="username"
            type="text"
            placeholder="Enter your username"
            required
            disabled={isPending}
          />
        </>
        <InputField
          id="email"
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          disabled={isPending}
        />
        <InputField
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
        <Button className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : buttonText}
        </Button>
        <p className="text-sm">
          Already have an account?{' '}
          <Link
            href="/sign-up"
            className={`underline ${isPending ? 'pointer-events-none opacity-50' : ''}`}
          >
            Sign In
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}
