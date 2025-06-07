import React from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { getUser } from '@/auth/server';

import shadow from '@/styles/utils';

import { Button } from './ui/button';
import DarkModeToggle from './DarkModeToggle';

export default async function Header() {
  const user = await getUser();
  const username = user?.user_metadata?.username ?? 'User';

  return (
    <header
      className="relative flex h-24 w-full items-center justify-between bg-popover px-3 sm:px-8 "
      style={{
        boxShadow: shadow,
      }}
    >
      <Link
        href="/"
        // className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100"
      >
        <Image
          src="/logo-light.svg"
          alt="NOTFIT Logo"
          width={105}
          height={75}
          priority
          className="block dark:hidden"
        />
        <Image
          src="/logo-dark-mode.svg"
          alt="NOTFIT Logo"
          width={105}
          height={75}
          priority
          className="hidden dark:block"
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
        {!user && (
          <Button asChild variant="secondary">
            <Link
              href="/sign-up"
              className="font-[family-name:var(--font-lemon)] py-5 px-6"
            >
              Sign Up
            </Link>
          </Button>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}
