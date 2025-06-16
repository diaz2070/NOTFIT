/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import RoutineHeader from '@/components/Routine/RoutineHeader';
import '@testing-library/jest-dom';

describe('<RoutineHeader />', () => {
  it('renders the back button with icon and label', () => {
    const { container } = render(
      <RoutineHeader
        title="New Routine Details"
        subtitle="Create a new custom workout routine"
      />,
    );
    const link = screen.getByRole('link', { name: /back to routines/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/routines');

    const icon = container.querySelector('.lucide-arrow-left');
    expect(icon).toBeInTheDocument();
  });

  it('renders the title and subtitle correctly', () => {
    render(
      <RoutineHeader
        title="New Routine Details"
        subtitle="Create a new custom workout routine"
      />,
    );
    expect(
      screen.getByRole('heading', { name: /new routine details/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/create a new custom workout routine/i),
    ).toBeInTheDocument();
  });
});
