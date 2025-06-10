import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img {...props} alt={props.alt ?? 'mocked image'} />;
  },
}));

describe('Home', () => {
  it('renders heading and description', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', { name: /welcome to notfit/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/your personal fitness companion/i),
    ).toBeInTheDocument();
  });

  it('renders dark and light logo images', () => {
    render(<Home />);

    const images = screen.getAllByAltText(/fitness hero image/i);
    expect(images.length).toBe(2);

    expect(images[0]).toHaveAttribute(
      'src',
      expect.stringContaining('logo-dark.svg'),
    );
    expect(images[1]).toHaveAttribute(
      'src',
      expect.stringContaining('logo-light.svg'),
    );
  });
});
