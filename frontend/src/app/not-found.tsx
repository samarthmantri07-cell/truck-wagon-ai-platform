import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
      <div className="text-[120px] font-semibold font-mono text-muted/30 leading-none select-none">
        404
      </div>
      <h1 className="mt-4 text-display-sm font-semibold">Page not found</h1>
      <p className="mt-3 text-body-md text-muted-foreground max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-10 flex gap-3">
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all hover:-translate-y-0.5"
        >
          Return to Console
        </Link>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
