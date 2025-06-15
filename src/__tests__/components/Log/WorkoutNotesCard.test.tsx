import { render, screen, fireEvent } from '@testing-library/react';
import WorkoutNotesCard from '@/components/log/WorkoutNotesCard';

describe('WorkoutNotesCard', () => {
  it('renders the title and description', () => {
    render(<WorkoutNotesCard notes="" onChange={jest.fn()} />);

    expect(screen.getByText('Workout Notes')).toBeInTheDocument();
    expect(
      screen.getByText(/Add notes about your workout/i),
    ).toBeInTheDocument();
  });

  it('displays the initial notes value', () => {
    render(<WorkoutNotesCard notes="Felt great!" onChange={jest.fn()} />);
    expect(screen.getByRole('textbox')).toHaveValue('Felt great!');
  });

  it('calls onChange when the textarea changes', () => {
    const handleChange = jest.fn();
    render(<WorkoutNotesCard notes="" onChange={handleChange} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hard workout' } });

    expect(handleChange).toHaveBeenCalledWith('Hard workout');
  });

  it('shows the placeholder text', () => {
    render(<WorkoutNotesCard notes="" onChange={jest.fn()} />);
    expect(
      screen.getByPlaceholderText(
        /I felt full of energy, increased the weight/i,
      ),
    ).toBeInTheDocument();
  });
});
