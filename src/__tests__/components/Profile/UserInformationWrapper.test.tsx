/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import UserInformationWrapper from '@/components/Profile/UserInformationWrapper';
import { getUser } from '@/auth/server';

jest.mock('@/auth/server', () => ({
  getUser: jest.fn(),
}));

jest.mock('@/components/Profile/ProfileInformation', () => ({
  __esModule: true,
  default: ({
    name,
    email,
    username,
  }: {
    name: string;
    email: string;
    username: string;
  }) => (
    <div data-testid="ProfileInformation">
      Name: {name}, Email: {email}, Username: {username}
    </div>
  ),
}));

jest.mock('@/components/Profile/ChangePasswordForm', () => ({
  __esModule: true,
  default: ({ email }: { email: string }) => (
    <div data-testid="ChangePasswordForm">Change password for: {email}</div>
  ),
}));

describe('UserInformationWrapper', () => {
  it('renders ProfileInformation and ChangePasswordForm with user data', async () => {
    (getUser as jest.Mock).mockResolvedValue({
      email: 'jane@example.com',
      user_metadata: {
        fullName: 'Jane Doe',
        username: 'janedoe',
      },
    });

    render(await UserInformationWrapper());

    expect(screen.getByTestId('ProfileInformation')).toHaveTextContent(
      'Name: Jane Doe, Email: jane@example.com, Username: janedoe',
    );
    expect(screen.getByTestId('ChangePasswordForm')).toHaveTextContent(
      'Change password for: jane@example.com',
    );
  });

  it('renders fallback values when user is null', async () => {
    (getUser as jest.Mock).mockResolvedValue(null);

    render(await UserInformationWrapper());

    expect(screen.getByTestId('ProfileInformation')).toHaveTextContent(
      'Name: , Email: , Username:',
    );
    expect(screen.getByTestId('ChangePasswordForm')).toHaveTextContent(
      'Change password for:',
    );
  });
});
