import { render, screen, fireEvent } from '@testing-library/react';
import InputNumeric from '@/components/log/InputNumeric';

describe('InputNumeric', () => {
  it('renders with initial value', () => {
    render(<InputNumeric value={5} onValidChange={jest.fn()} />);
    expect(screen.getByRole('textbox')).toHaveValue('5');
  });

  it('calls onValidChange with integer input', () => {
    const handleChange = jest.fn();
    render(<InputNumeric value={0} onValidChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '42' } });

    expect(handleChange).toHaveBeenCalledWith(42);
  });

  it('calls onValidChange with decimal input when allowed', () => {
    const handleChange = jest.fn();
    render(
      <InputNumeric value={0} allowDecimals onValidChange={handleChange} />,
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '12.34' } });

    expect(handleChange).toHaveBeenCalledWith(12.34);
  });

  it('does not call onValidChange with invalid input', () => {
    const handleChange = jest.fn();
    render(<InputNumeric value={0} onValidChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'abc' } });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('resets to 0 on blur with invalid input', () => {
    const handleChange = jest.fn();
    render(<InputNumeric value={0} onValidChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.blur(input);

    expect(input).toHaveValue('0');
    expect(handleChange).toHaveBeenCalledWith(0);
  });

  it('uses placeholder if provided', () => {
    render(
      <InputNumeric
        value={0}
        onValidChange={jest.fn()}
        placeholder="Enter a number"
      />,
    );

    const input = screen.getByPlaceholderText('Enter a number');
    expect(input).toBeInTheDocument();
  });
});
