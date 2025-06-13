import React from 'react';
import { Badge } from '@/components/ui/badge';
import getCategoryColor from '@/utils/getCategoryColor';

interface ExerciseBadgeProps {
  label: string;
  variant?: 'outline' | 'secondary';
  colorCategory?: boolean;
}

export default function ExerciseBadge({
  label,
  variant = 'outline',
  colorCategory = false,
}: Readonly<ExerciseBadgeProps>) {
  const className = colorCategory ? getCategoryColor(label) : '';
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
