import { getUser } from '@/auth/server';
import ChangePasswordForm from './ChangePasswordForm';
import ProfileInformation from './ProfileInformation';

export default async function UserInformationWrapper() {
  const user = await getUser();
  console.log('User Information:', user);
  return (
    <>
      <ProfileInformation
        name={user?.user_metadata?.fullName ?? ''}
        email={user?.email ?? ''}
        username={user?.user_metadata?.username ?? ''}
      />
      <ChangePasswordForm email={user?.email ?? ''} />
    </>
  );
}
