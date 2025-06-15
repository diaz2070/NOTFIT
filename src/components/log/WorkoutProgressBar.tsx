'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Timer } from 'lucide-react';
import Spinner from '../ui/spinner';

interface WorkoutProgressBarProps {
  status: 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED';
  startTime: Date;
  totalCompletedSets: number;
  totalSets: number;
  pausedAt: Date | null;
  onPause: (e: React.MouseEvent) => void;
  onResume: (e: React.MouseEvent) => void;
  isPausing?: boolean;
  isResuming?: boolean;
}

function getStatusLabel(status: 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED'): {
  label: string;
  variant: 'default' | 'secondary' | 'outline';
} {
  switch (status) {
    case 'IN_PROGRESS':
      return { label: 'In Progress', variant: 'default' };
    case 'PAUSED':
      return { label: 'Paused', variant: 'secondary' };
    case 'COMPLETED':
      return { label: 'Completed', variant: 'outline' };
    default:
      return { label: 'Unknown', variant: 'secondary' };
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}

export default function WorkoutProgressBar({
  status,
  startTime,
  totalCompletedSets,
  totalSets,
  pausedAt,
  onPause,
  onResume,
  isPausing,
  isResuming,
}: Readonly<WorkoutProgressBarProps>) {
  const [elapsed, setElapsed] = useState<number>(0);
  const [totalPaused, setTotalPaused] = useState<number>(0);
  const [lastPauseStart, setLastPauseStart] = useState<Date | null>(pausedAt);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const baseElapsed = Math.floor(
        (now.getTime() - startTime.getTime()) / 1000,
      );
      const pausedDuration =
        totalPaused +
        (lastPauseStart
          ? Math.floor((now.getTime() - lastPauseStart.getTime()) / 1000)
          : 0);
      setElapsed(Math.max(0, baseElapsed - pausedDuration));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, totalPaused, lastPauseStart]);

  useEffect(() => {
    if (pausedAt) {
      setLastPauseStart(pausedAt);
    } else if (lastPauseStart) {
      const now = new Date();
      const pauseSeconds = Math.floor(
        (now.getTime() - lastPauseStart.getTime()) / 1000,
      );
      setTotalPaused((prev) => prev + pauseSeconds);
      setLastPauseStart(null);
    }
  }, [pausedAt]);

  const { label, variant } = getStatusLabel(status);

  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
          <h2 className="text-lg font-semibold">Progress</h2>
          <Badge variant={variant}>{label}</Badge>
        </div>
        <p className="text-muted-foreground text-sm mt-2 md:mt-0">
          {totalCompletedSets} of {totalSets} sets completed
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-2">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Timer className="h-3 w-3" />
          {formatTime(elapsed)}
        </Badge>
        {status === 'IN_PROGRESS' && (
          <Button variant="outline" size="sm" onClick={(e) => onPause(e)}>
            {isPausing ? <Spinner size={14} /> : 'Pause'}
          </Button>
        )}
        {status === 'PAUSED' && (
          <Button variant="outline" size="sm" onClick={(e) => onResume(e)}>
            {isResuming ? <Spinner size={14} /> : 'Resume'}
          </Button>
        )}
      </div>
    </div>
  );
}
