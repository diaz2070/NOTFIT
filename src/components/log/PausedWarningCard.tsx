'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface Props {
  pausedAt: Date | null;
  visible: boolean;
  isPausing?: boolean;
  isResuming?: boolean;
}

export default function PausedWarningCard({
  pausedAt,
  visible,
  isPausing,
  isResuming,
}: Readonly<Props>) {
  if (!visible) return null;
  if (isPausing || isResuming) return null;

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardContent>
        <div className="flex items-center gap-2 text-yellow-800">
          <Clock className="h-4 w-4" />
          <p className="text-sm">
            Workout paused since {pausedAt?.toLocaleTimeString()}. You can close
            the site and come back later to continue.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
