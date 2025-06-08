import { render, screen } from '@testing-library/react';
import ThemeProvider from '@/providers/ThemeProvider';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system">
        <div data-testid="theme-child">Hello</div>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('theme-child')).toBeInTheDocument();
  });
});
