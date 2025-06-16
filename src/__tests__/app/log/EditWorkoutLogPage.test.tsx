// src/__tests__/app/EditWorkoutLogPage.test.tsx

import { render } from '@testing-library/react';
import EditWorkoutLogPage from '@/app/log/[logId]/edit/page';
import { getUser } from '@/auth/server';
import getWorkoutLogById from '@/actions/getWorkoutById';
import { notFound } from 'next/navigation';

jest.mock('@/auth/server', () => ({
  getUser: jest.fn(),
}));

jest.mock('@/actions/getWorkoutById', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

jest.mock('@/components/log/WorkoutLogPage', () => {
  return function MockWorkoutLogPage() {
    return <div>WorkoutLogPage</div>;
  };
});

describe('EditWorkoutLogPage', () => {
  const mockParams = { logId: 'log123' };

  it('renders WorkoutLogPage with valid log and user', async () => {
    const mockUser = { id: 'user1' };
    const mockLog = {
      id: 'log123',
      userId: 'user1',
      routine: { id: 'routine1' },
    };

    (getUser as jest.Mock).mockResolvedValue(mockUser);
    (getWorkoutLogById as jest.Mock).mockResolvedValue(mockLog);

    const result = await EditWorkoutLogPage({ params: mockParams });

    const { getByText } = render(result);
    expect(getByText('WorkoutLogPage')).toBeInTheDocument();
  });

  it('calls notFound if log does not exist', async () => {
    (getUser as jest.Mock).mockResolvedValue({ id: 'user1' });
    (getWorkoutLogById as jest.Mock).mockResolvedValue(null);

    await EditWorkoutLogPage({ params: mockParams });

    expect(notFound).toHaveBeenCalled();
  });

  it('calls notFound if log does not belong to user', async () => {
    (getUser as jest.Mock).mockResolvedValue({ id: 'user1' });
    (getWorkoutLogById as jest.Mock).mockResolvedValue({
      id: 'log123',
      userId: 'user2', // Different user
    });

    await EditWorkoutLogPage({ params: mockParams });

    expect(notFound).toHaveBeenCalled();
  });
});
