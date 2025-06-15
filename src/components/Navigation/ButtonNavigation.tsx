import { Home, Calendar, History, User as UserIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';

function ButtonNavigation() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Routines', href: '/routines', icon: Calendar },
    { name: 'Log', href: '/workout/log', icon: Plus },
    { name: 'History', href: '/history', icon: History },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];
  return (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.name}
            variant={isActive(item.href) ? 'default' : 'ghost'}
            asChild
            className="flex justify-start md:items-center gap-1 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
          >
            <Link
              href={item.href}
              className={`font-[family-name:var(--font-lemon)] ${
                isActive(item.href) ? 'text-white hover:text-white' : ''
              } `}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        );
      })}
    </>
  );
}

export default ButtonNavigation;
