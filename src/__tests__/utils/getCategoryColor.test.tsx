
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';
import getCategoryColor from '@/utils/getCategoryColor';

function CategoryBadge({ category }: Readonly<{ category: string }>) {
  const color =
    getCategoryColor(category) ??
    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';

  return <Badge className={color}>{category}</Badge>;
}

describe('getCategoryColor fallback', () => {
  it('uses fallback color for unknown category', () => {
    render(<CategoryBadge category="UnknownCategory" />);
    const badge = screen.getByText('UnknownCategory');
    expect(badge).toHaveClass(
      'bg-gray-100',
      'text-gray-800',
      'dark:bg-gray-900',
      'dark:text-gray-200',
    );
  });
});
