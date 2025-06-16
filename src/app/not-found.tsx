'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, Dumbbell, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="border-2 border-dashed border-muted-foreground/20">
          <CardContent className="p-12">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-9xl font-bold text-primary/20 select-none">
                404
              </h1>
            </div>

            {/* Dumbbell Icon */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                <Dumbbell className="w-10 h-10 text-primary" />
              </div>
            </div>

            {/* Main Message */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Page Not Found
              </h2>
              <p className="text-lg text-muted-foreground mb-2">
                Looks like this page skipped leg day and disappeared!
              </p>
              <p className="text-muted-foreground">
                The page you&apos;re looking for doesn&apos;t exist or has been
                moved.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go to Home
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href="/routines" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Browse Routines
                </Link>
              </Button>
            </div>

            {/* Back Button */}
            <div className="mt-8 pt-8 border-t border-muted-foreground/20">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </div>

            {/* Additional Help */}
            <div className="mt-8 text-sm text-muted-foreground">
              <p>Need help? Try these popular pages:</p>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <Link
                  href="/log"
                  className="text-primary hover:text-primary/80 underline underline-offset-4"
                >
                  Log a Workout
                </Link>
                <Link
                  href="/history"
                  className="text-primary hover:text-primary/80 underline underline-offset-4"
                >
                  Workout History
                </Link>
                <Link
                  href="/profile"
                  className="text-primary hover:text-primary/80 underline underline-offset-4"
                >
                  Profile Settings
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fun Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Pages Found</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">404</div>
            <div className="text-sm text-muted-foreground">Error Code</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">∞</div>
            <div className="text-sm text-muted-foreground">Better Pages</div>
          </div>
        </div>
      </div>
    </div>
  );
}
