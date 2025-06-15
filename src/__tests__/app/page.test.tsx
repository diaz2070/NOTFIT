import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      {...props}
      alt={props.alt ?? 'mocked image'}
      data-testid="next-image"
    />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className} data-testid="next-link">
      {children}
    </a>
  ),
}));

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders main headline and description', () => {
    render(<Home />);

    const headingText = screen.getByText('Track Your Fitness Journey Like');
    expect(headingText).toBeInTheDocument();

    const spanText = screen.getByText('Never Before');
    expect(spanText).toBeInTheDocument();

    expect(
      screen.getByText(/NOTFIT helps you create custom workout routines/i),
    ).toBeInTheDocument();
  });

  it('renders dark and light logo images', () => {
    render(<Home />);

    const images = screen.getAllByTestId('next-image');
    expect(images).toHaveLength(2);

    const darkLogo = images.find(
      (img) => img.getAttribute('src') === '/logo-dark.svg',
    );
    const lightLogo = images.find(
      (img) => img.getAttribute('src') === '/logo-light.svg',
    );

    expect(darkLogo).toBeInTheDocument();
    expect(lightLogo).toBeInTheDocument();
  });
  it('renders CTA buttons with correct links', () => {
    render(<Home />);

    const links = screen.getAllByTestId('next-link');
    const signUpLink = links.find(
      (link) => link.getAttribute('href') === '/sign-up',
    );

    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink?.textContent).toContain('Start Your Journey');

    const demoButton = screen.getByText('Watch Demo');
    expect(demoButton).toBeInTheDocument();
  });

  it('renders all feature cards', () => {
    render(<Home />);

    expect(
      screen.getByText('Everything You Need to Succeed'),
    ).toBeInTheDocument();

    const featureTitles = [
      'Custom Routines',
      'Progress Tracking',
      'Exercise Library',
      'Community Support',
      'Goal Mindset',
      'Easy Logging',
    ];

    featureTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('renders the call-to-action section', () => {
    render(<Home />);

    expect(
      screen.getByText('Ready to Transform Your Fitness Journey?'),
    ).toBeInTheDocument();

    const links = screen.getAllByTestId('next-link');
    const startTodayLink = links.find((link) =>
      link.textContent?.includes('Start Today'),
    );

    expect(startTodayLink).toBeInTheDocument();
    expect(startTodayLink?.getAttribute('href')).toBe('/sign-up');
  });

  it('renders the footer with copyright information', () => {
    render(<Home />);

    expect(
      screen.getByText(/© 2025 NOTFIT. All rights reserved./i),
    ).toBeInTheDocument();
  });
});
