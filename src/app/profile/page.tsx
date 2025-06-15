import type React from 'react';

import UserInformationWrapper from '@/components/Profile/UserInformationWrapper';
import AccountActions from '@/components/Profile/AccountActions';

export default async function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UserInformationWrapper />
        </div>

        <AccountActions />
      </main>
    </div>
  );
}
