import React from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { getUser } from '@/auth/server';

import shadow from '@/styles/utils';

import { Button } from './ui/button';
import DarkModeToggle from './DarkModeToggle';
import LogoutButton from './LogoutButton';

export default async function Header() {
  const user = await getUser();
  const username = user?.user_metadata?.username ?? 'User';

  return (
    <header
      className="relative flex h-20 w-full items-center justify-between bg-popover px-3 sm:px-8"
      style={{
        boxShadow: shadow,
      }}
    >
      <Link href="/">
        <Image
          src="/logo-light.svg"
          alt="NOTFIT Logo"
          width={105}
          height={75}
          priority
          className="block dark:hidden mt-1"
        />
        <Image
          src="/logo-dark.svg"
          alt="NOTFIT Logo"
          width={105}
          height={75}
          priority
          className="hidden dark:block mt-1"
        />
      </Link>

      <div className="flex gap-4 items-center">
        {user && (
          <div className="flex flex-col">
            <p className="font-[family-name:var(--font-lemon)] text-primary-dark-mode text-md">
              Welcome back {username}
            </p>
          </div>
        )}
        {user && <LogoutButton />}
        {!user && (
          <>
            <Button asChild>
              <Link
                href="/sign-in"
                className="font-[family-name:var(--font-lemon)]  py-5 px-6 text-white"
              >
                Sign In
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link
                href="/sign-up"
                className="font-[family-name:var(--font-lemon)] py-5 px-6"
              >
                Sign Up
              </Link>
            </Button>
          </>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}
