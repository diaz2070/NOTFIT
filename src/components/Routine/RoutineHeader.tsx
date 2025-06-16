'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface RoutineHeaderProps {
  title: string;
  subtitle: string;
}

export default function RoutineHeader({
  title,
  subtitle,
}: Readonly<RoutineHeaderProps>) {
  return (
    <div className="mb-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/routines">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Routines
        </Link>
      </Button>
      <h1 className="text-3xl font-bold text-foreground mb-2 font-[family-name:var(--font-lemon)]">
        {title}
      </h1>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  );
}
