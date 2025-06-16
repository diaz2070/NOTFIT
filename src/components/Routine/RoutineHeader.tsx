'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RoutineHeader() {
  return (
    <div className="mb-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/routines">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Routines
        </Link>
      </Button>
      <h1 className="text-3xl font-bold text-foreground mb-2 font-[family-name:var(--font-lemon)]">
        New Routine Details
      </h1>
      <p className="text-muted-foreground">
        Create a new custom workout routine
      </p>
    </div>
  );
}
