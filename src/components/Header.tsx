import React from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { getUser } from '@/auth/server';

import shadow from '@/styles/utils';
import MobileNavigation from './Navigation/MobileNavigation';
import DesktopNavigation from './Navigation/DesktopNavigation';

export default async function Header() {
  const user = await getUser();

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

      <div className="hidden md:flex gap-2 items-center">
        <DesktopNavigation user={user} />
      </div>
      <MobileNavigation user={user} />
    </header>
  );
}
