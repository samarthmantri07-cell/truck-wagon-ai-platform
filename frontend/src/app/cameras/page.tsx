'use client';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { MOCK_CAMERAS } from '@/constants/mockData';
import { cn } from '@/lib/utils';
import { Wifi, WifiOff, AlertCircle, Camera, Activity } from 'lucide-react';

function StatusIcon({ status }: { status: 'online' | 'offline' | 'warning' }) {
  if (status === 'online')  return <Wifi        className="w-4 h-4 text-success" />;
  if (status === 'offline') return <WifiOff     className="w-4 h-4 text-error" />;
  return                           <AlertCircle  className="w-4 h-4 text-warning" />;
}

export default function Cameras() {
  return (
    <DashboardLayout title="Camera Management">
      <div className="mb-8">
        <h1 className="text-display-sm font-semibold tracking-tight">Cameras</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Monitor and manage all connected camera streams.
        </p>
      </div>

      {/* Summary pills */}
      <div className="flex items-center gap-3 mb-8">
        {[
          { label: 'Online', count: MOCK_CAMERAS.filter(c => c.status === 'online').length, color: 'text-success' },
          { label: 'Warning', count: MOCK_CAMERAS.filter(c => c.status === 'warning').length, color: 'text-warning' },
          { label: 'Offline', count: MOCK_CAMERAS.filter(c => c.status === 'offline').length, color: 'text-error' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card">
            <span className={cn('text-lg font-semibold font-mono', s.color)}>{s.count}</span>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {MOCK_CAMERAS.map((cam, i) => (
          <motion.div
            key={cam.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-border bg-card overflow-hidden group"
          >
            {/* Camera preview area */}
            <div className="aspect-video bg-slate-950 relative overflow-hidden">
              {cam.status === 'online' && (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent scan-line" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className={cn('w-8 h-8', cam.status === 'online' ? 'text-slate-600' : 'text-slate-700/50')} />
              </div>
              {/* Status overlay top-left */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <StatusIcon status={cam.status} />
                <span className={cn(
                  'text-xs font-semibold uppercase tracking-wide',
                  cam.status === 'online' ? 'text-emerald-400' :
                  cam.status === 'warning' ? 'text-amber-400' : 'text-red-400'
                )}>
                  {cam.status}
                </span>
              </div>
              {cam.status === 'online' && (
                <div className="absolute bottom-3 right-3 text-slate-500 text-[10px] font-mono">{cam.fps} fps</div>
              )}
            </div>

            {/* Info */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">{cam.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{cam.gate}</div>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{cam.id}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="label-xs">Resolution</span>
                  <span className="text-xs font-mono text-foreground">{cam.resolution}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="label-xs">Frame Rate</span>
                  <span className={cn(
                    'text-xs font-mono font-semibold',
                    cam.fps >= 25 ? 'text-success' : cam.fps > 0 ? 'text-warning' : 'text-error'
                  )}>
                    {cam.fps > 0 ? `${cam.fps} fps` : 'Offline'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="label-xs">RTSP</span>
                  <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[140px]">{cam.rtspUrl}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 h-8 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors">
                  Configure
                </button>
                <button className={cn(
                  'flex-1 h-8 rounded-lg text-xs font-medium transition-colors',
                  cam.status === 'offline'
                    ? 'bg-foreground text-background hover:bg-foreground/90'
                    : 'bg-error/10 text-error hover:bg-error/20'
                )}>
                  {cam.status === 'offline' ? 'Reconnect' : 'Disconnect'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
