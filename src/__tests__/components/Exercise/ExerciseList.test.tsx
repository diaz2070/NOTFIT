import { render, screen, fireEvent } from '@testing-library/react';
import ExerciseList from '@/components/Exercise/ExerciseList';
import { ExerciseCategory, MuscleTarget } from '@prisma/client';

jest.mock('@/utils/getCategoryColor', () => () => 'bg-blue-100 text-blue-800');
jest.mock('@/utils/formatLabel', () => (value: string) => value);
jest.mock('next/image', () => {
  return {
    __esModule: true,
    default: function NextImage({
      alt,
      src,
      ...props
    }: {
      alt: string;
      src: string;
      [key: string]: unknown;
    }) {
      return <img alt={alt} src={src} {...props} />;
    },
  };
});
jest.mock('@/components/exercise/Pagination', () => ({
  __esModule: true,
  default: ({ page, totalPages }: { page: number; totalPages: number }) => (
    <div>
      <span>
        Page {page} of {totalPages}
      </span>
    </div>
  ),
}));

const mockExercise = {
  id: '1',
  name: 'push up',
  category: ExerciseCategory.Chest,
  primaryMuscles: [MuscleTarget.Pectorals],
  secondaryMuscles: [],
  description: 'Upper body movement',
  instructions: ['Push up and down'],
  imageUrl: '',
  createdAt: new Date(),
};

describe('<ExerciseList />', () => {
  it('renders list of exercises', () => {
    render(
      <ExerciseList
        exercises={[mockExercise]}
        selectedExercises={[]}
        onToggleSelect={jest.fn()}
        page={1}
        totalPages={3}
        nextPage={jest.fn()}
        prevPage={jest.fn()}
      />,
    );

    expect(screen.getByText(/push up/i)).toBeInTheDocument();
    expect(screen.getByText(/Upper body movement/i)).toBeInTheDocument();
    expect(screen.getByText(/Page 1 of 3/i)).toBeInTheDocument();
  });

  it('marks exercise as selected if in selectedExercises', () => {
    const { container } = render(
      <ExerciseList
        exercises={[mockExercise]}
        selectedExercises={[mockExercise]}
        onToggleSelect={jest.fn()}
        page={1}
        totalPages={1}
        nextPage={jest.fn()}
        prevPage={jest.fn()}
      />,
    );

    const card = container.querySelector('.ring-primary');
    expect(card).toBeTruthy();
  });

  it('calls onToggleSelect when card is clicked', () => {
    const handleToggle = jest.fn();

    render(
      <ExerciseList
        exercises={[mockExercise]}
        selectedExercises={[]}
        onToggleSelect={handleToggle}
        page={1}
        totalPages={1}
        nextPage={jest.fn()}
        prevPage={jest.fn()}
      />,
    );

    const card = screen.getByText(/push up/i).closest('div');
    fireEvent.click(card!);

    expect(handleToggle).toHaveBeenCalledWith(mockExercise);
  });
});
