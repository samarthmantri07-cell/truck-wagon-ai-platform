import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
      <h1 className="text-9xl font-bold font-mono text-slate-200">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>
      <p className="mt-2 text-slate-500 max-w-md">The page you are looking for doesn&apos;t exist or has been moved.</p>
      <Button asChild className="mt-8">
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
