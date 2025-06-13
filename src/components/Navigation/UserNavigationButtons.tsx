import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';

function UserNavigationButtons() {
  return (
    <>
      <Button asChild>
        <Link
          href="/sign-in"
          className="w-full md:w-fit font-[family-name:var(--font-lemon)]  py-5 px-6 text-white"
        >
          Sign In
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link
          href="/sign-up"
          className="w-full md:w-fit font-[family-name:var(--font-lemon)] py-5 px-6"
        >
          Sign Up
        </Link>
      </Button>
    </>
  );
}

export default UserNavigationButtons;
