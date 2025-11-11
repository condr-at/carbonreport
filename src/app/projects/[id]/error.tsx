'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Project tab error', error);
  }, [error]);

  return (
    <div className="space-y-4 rounded-xl border border-destructive/30 bg-destructive/5 p-6">
      <div>
        <h2 className="text-lg font-semibold text-destructive">Something went wrong</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We couldn’t load this section of the project. Please try again.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reload page
        </Button>
      </div>
      {error.digest ? (
        <p className="text-xs text-muted-foreground">Error reference: {error.digest}</p>
      ) : null}
    </div>
  );
}