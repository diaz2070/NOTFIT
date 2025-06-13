'use client';

import { useState } from 'react';
import { Dumbbell, Menu } from 'lucide-react';

import { User } from '@supabase/supabase-js';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '../ui/button';
import DarkModeToggle from './DarkModeToggle';
import ButtonNavigation from './ButtonNavigation';
import LogoutButton from './LogoutButton';
import UserNavigationButtons from './UserNavigationButtons';

interface DesktopNavigationProps {
  user: User | null;
}

export default function MobileNavigation({
  user,
}: Readonly<DesktopNavigationProps>) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="text-gray-700 dark:text-gray-200"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 p-6 bg-white dark:bg-gray-900">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-primary p-2 rounded-lg">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            NOTFIT
          </span>
        </div>
        <nav className="space-y-2">
          {user && <ButtonNavigation />}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            {!user && <UserNavigationButtons />}
            <div className="flex flex-col gap-2">
              <DarkModeToggle />
              {user && <LogoutButton />}
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
