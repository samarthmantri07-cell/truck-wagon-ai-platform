'use client';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Vantage AI Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
      <div className="text-[120px] font-semibold font-mono text-error/10 leading-none select-none">
        500
      </div>
      <h1 className="mt-4 text-display-sm font-semibold">Something went wrong</h1>
      <p className="mt-3 text-body-md text-muted-foreground max-w-sm">
        An unexpected error occurred. The engineering team has been notified.
      </p>
      <div className="mt-10 flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all hover:-translate-y-0.5"
        >
          Try again
        </button>
        <a
          href="/dashboard"
          className="px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all"
        >
          Return to Console
        </a>
      </div>
    </div>
  );
}
