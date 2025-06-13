import { render, screen, fireEvent } from '@testing-library/react';
import ExerciseFiltersPanel from '@/components/Exercise/ExerciseFiltersPanel';
import '@testing-library/jest-dom';

const mockUpdateFilter = jest.fn();
const mockClearFilters = jest.fn();
const mockNextPage = jest.fn();
const mockPrevPage = jest.fn();

const defaultProps = {
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

describe('ExerciseFiltersPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all filter controls and buttons', () => {
    render(<ExerciseFiltersPanel {...defaultProps} />);

    expect(
      screen.getByPlaceholderText('Search exercises...'),
    ).toBeInTheDocument();
    expect(screen.getByText('Filter')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Muscle')).toBeInTheDocument();
  });

  it('calls updateFilter on search input change', () => {
    render(<ExerciseFiltersPanel {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search exercises...');
    fireEvent.change(input, { target: { value: 'press' } });
    expect(mockUpdateFilter).toHaveBeenCalledWith('search', 'press');
  });

  it('calls updateFilter when changing sort option manually', () => {
    render(<ExerciseFiltersPanel {...defaultProps} />);
    defaultProps.updateFilter('sort', 'name');
    expect(mockUpdateFilter).toHaveBeenCalledWith('sort', 'name');
  });

  it('calls updateFilter when changing category manually', () => {
    render(<ExerciseFiltersPanel {...defaultProps} />);
    defaultProps.updateFilter('category', 'back');
    expect(mockUpdateFilter).toHaveBeenCalledWith('category', 'back');
  });

  it('calls updateFilter when changing muscle manually', () => {
    render(<ExerciseFiltersPanel {...defaultProps} />);
    defaultProps.updateFilter('muscle', 'triceps');
    expect(mockUpdateFilter).toHaveBeenCalledWith('muscle', 'triceps');
  });

  it('calls clearFilters when clicking Clear button', () => {
    render(<ExerciseFiltersPanel {...defaultProps} />);
    fireEvent.click(screen.getByText('Clear'));
    expect(mockClearFilters).toHaveBeenCalled();
  });
});
