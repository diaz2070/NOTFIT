/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTheme } from 'next-themes';
import DarkModeToggle from '@/components/Navigation/DarkModeToggle';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('DarkModeToggle', () => {
  const setTheme = jest.fn();

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({ setTheme });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the toggle button', () => {
    render(<DarkModeToggle />);
    expect(
      screen.getByRole('button', { name: /toggle theme/i }),
    ).toBeInTheDocument();
  });

  it('displays dropdown options and calls setTheme on selection', async () => {
    render(<DarkModeToggle />);
    const user = userEvent.setup();

    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);

    await user.click(screen.getByText('Light'));
    expect(setTheme).toHaveBeenCalledWith('light');

    await user.click(button);
    await user.click(screen.getByText('Dark'));
    expect(setTheme).toHaveBeenCalledWith('dark');

    await user.click(button);
    await user.click(screen.getByText('System'));
    expect(setTheme).toHaveBeenCalledWith('system');
  });
});
