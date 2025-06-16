'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, LogOut } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { logoutAction } from '@/actions/user';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AccountActions() {
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
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Account Actions</CardTitle>
        <CardDescription>
          Manage your session and account settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Separator />
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Log Out</h3>
              <p className="text-sm text-gray-500">
                Log out of your current session on this device
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout} disabled={loading}>
              {loading ? (
                <Loader2 data-testid="loader-icon" className="animate-spin" />
              ) : (
                <div className="flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Log Out</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
