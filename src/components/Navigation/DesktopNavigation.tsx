'use client';

import { User } from '@supabase/supabase-js';

import LogoutButton from './LogoutButton';
import DarkModeToggle from './DarkModeToggle';
import ButtonNavigation from './ButtonNavigation';
import UserNavigationButtons from './UserNavigationButtons';

interface DesktopNavigationProps {
  user: User | null;
}

function DesktopNavigation({ user }: Readonly<DesktopNavigationProps>) {
  return (
    <>
      {user && (
        <>
          <ButtonNavigation />
          <LogoutButton />
        </>
      )}
      {!user && <UserNavigationButtons />}
      <DarkModeToggle />
    </>
  );
}

export default DesktopNavigation;
