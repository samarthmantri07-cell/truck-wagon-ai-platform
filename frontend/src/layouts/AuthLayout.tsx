import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left — story panel */}
      <div className="hidden lg:flex flex-col w-[50%] bg-foreground text-background p-16 justify-between relative overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative z-10">
          <span className="text-base font-semibold tracking-tight">Vantage AI</span>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="w-12 h-0.5 bg-background/25 mb-10" />
          <blockquote className="text-display-sm font-semibold text-balance leading-tight text-background">
            &ldquo;Every vehicle.
            <br />Every gate.
            <br />Every second.&rdquo;
          </blockquote>
          <p className="mt-8 text-body-md text-background/50 max-w-xs text-balance">
            Industrial Computer Vision Platform for Logistics, Railways, and Manufacturing.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-background/30 uppercase tracking-widest">
            Industrial AI Platform · Enterprise Edition
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        {children}
      </div>
    </div>
  );
}
