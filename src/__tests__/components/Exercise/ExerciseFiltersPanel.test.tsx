import { render, screen, fireEvent } from '@testing-library/react';
import ExerciseFiltersPanel from '@/components/Exercise/ExerciseFiltersPanel';

jest.mock('@/components/ui/select', () => ({
  Select: ({
    onValueChange,
    children,
    'data-testid': testId = 'select-mock',
  }: {
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    'data-testid': string;
  }) => (
    <div data-testid={testId}>
      {children}
      <button
        type="button"
        data-testid={`${testId}-value-button`}
        onClick={() => onValueChange('triceps')}
      >
        Select option
      </button>
    </div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <div data-testid={`select-item-${value}`}>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-trigger">{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <div data-testid="select-value">{placeholder}</div>
  ),
}));

describe('<ExerciseFiltersPanel />', () => {
  const mockUpdateFilter = jest.fn();
  const mockClearFilters = jest.fn();
  const mockNextPage = jest.fn();
  const mockPrevPage = jest.fn();

  const props = {
    filters: {
      search: '',
      sort: '',
      category: 'all',
      muscle: 'all',
    },
    updateFilter: mockUpdateFilter,
    clearFilters: mockClearFilters,
    categoryOptions: ['chest', 'back'],
    muscleOptions: ['biceps', 'triceps'],
    page: 1,
    totalPages: 3,
    nextPage: mockNextPage,
    prevPage: mockPrevPage,
  };

  it('calls updateFilter when selecting muscle option via mock dropdown', () => {
    render(<ExerciseFiltersPanel {...props} />);
    const muscleButton = screen.getByTestId('select-muscle-value-button');
    fireEvent.click(muscleButton);
    expect(mockUpdateFilter).toHaveBeenCalledWith('muscle', 'triceps');
  });

  it('calls updateFilter when typing in search input', () => {
    render(<ExerciseFiltersPanel {...props} />);
    const input = screen.getByPlaceholderText('Search exercises...');
    fireEvent.change(input, { target: { value: 'bicep' } });
    expect(mockUpdateFilter).toHaveBeenCalledWith('search', 'bicep');
  });

  it('calls updateFilter when selecting sort option via mock dropdown', () => {
    render(<ExerciseFiltersPanel {...props} />);
    const sortBtn = screen.getByTestId('select-sort-value-button');
    fireEvent.click(sortBtn);
    expect(mockUpdateFilter).toHaveBeenCalledWith('sort', 'triceps');
  });

  it('calls updateFilter when selecting category option via mock dropdown', () => {
    render(<ExerciseFiltersPanel {...props} />);
    const categoryBtn = screen.getByTestId('select-category-value-button');
    fireEvent.click(categoryBtn);
    expect(mockUpdateFilter).toHaveBeenCalledWith('category', 'triceps');
  });
});
