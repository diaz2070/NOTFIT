import { render, screen } from '@testing-library/react';
import ProfilePage from '@/app/profile/page';

jest.mock('@/components/Profile/UserInformationWrapper', () => ({
  __esModule: true,
  default: () => <div data-testid="UserInformationWrapper">User Info</div>,
}));

jest.mock('@/components/Profile/AccountActions', () => ({
  __esModule: true,
  default: () => <div data-testid="AccountActions">Account Actions</div>,
}));

describe('ProfilePage', () => {
  it('renders profile title and description', async () => {
    render(await ProfilePage());

    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(
      screen.getByText('Manage your personal information and account settings'),
    ).toBeInTheDocument();
  });

  it('renders UserInformationWrapper and AccountActions', async () => {
    render(await ProfilePage());

    expect(screen.getByTestId('UserInformationWrapper')).toBeInTheDocument();
    expect(screen.getByTestId('AccountActions')).toBeInTheDocument();
  });
});
