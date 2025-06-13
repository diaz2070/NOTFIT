'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/actions/user';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);

    const { errorMessage } = await logoutAction();

    if (!errorMessage) {
      toast.success('Logout Successful');
      router.push('/');
    } else {
      toast.error('Logout Failed:', {
        description: errorMessage,
      });
    }
    setLoading(false);
  };
  return (
    <Button
      className="w-full md:w-24 text-lemon-font"
      variant="outline"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <Loader2 data-testid="loader-icon" className="animate-spin" />
      ) : (
        'Log Out'
      )}
    </Button>
  );
}

export default LogoutButton;
