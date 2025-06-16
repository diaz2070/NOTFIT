import { render, screen } from '@testing-library/react';
import Page from '@/app/routines/edit/[id]/page';
import { getRoutineById } from '@/actions/routines';

jest.mock('@/actions/routines', () => ({
  getRoutineById: jest.fn(),
}));

jest.mock(
  '@/components/Routine/EditRoutinePage',
  () =>
    function EditRoutinePageMock({ routine }: { routine: { name: string } }) {
      return <div>EditRoutinePage Mock - {routine.name}</div>;
    },
);

describe('<EditRoutinePage route />', () => {
  it('renders the EditRoutinePage if routine exists', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Mock Routine',
      daysOfWeek: ['Monday'],
      exercises: [],
      userId: 'user123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    render(await Page({ params: { id: '1' } }));

    expect(
      await screen.findByText(/EditRoutinePage Mock - Mock Routine/),
    ).toBeInTheDocument();
  });

  it('renders fallback message if routine is not found', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue(null);

    render(await Page({ params: { id: '999' } }));

    expect(await screen.findByText(/Routine not found/i)).toBeInTheDocument();
  });
});
