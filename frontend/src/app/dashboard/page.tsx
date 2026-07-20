'use client';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { MOCK_EMPLOYEE, MOCK_KPI, MOCK_VEHICLES, MOCK_ALERTS } from '@/constants/mockData';
import { Truck, Box, Target, Wifi, AlertTriangle, TrendingUp, ShieldAlert, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── KPI metric card ─────────────────────────────────────── */
function KpiCard({
  label, value, sub, icon: Icon, delay = 0,
}: { label: string; value: string | number; sub?: string; icon: React.ElementType; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="p-5 rounded-xl border border-border bg-card hover:shadow-card-hover transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="label-xs">{label}</div>
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-foreground/5 transition-colors">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      <div className="text-2xl font-semibold font-mono text-foreground tracking-tight">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </motion.div>
  );
}

/* ─── Welcome strip ───────────────────────────────────────── */
function WelcomeStrip() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
    >
      <div>
        <p className="label-xs mb-1">{greeting}</p>
        <h1 className="text-display-sm font-semibold tracking-tight">{MOCK_EMPLOYEE.name}</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          {MOCK_EMPLOYEE.shift} · {MOCK_EMPLOYEE.gate}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-muted-foreground">
          <span className="live-dot" />
          {MOCK_KPI.activeCameras} Cameras Active
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-muted-foreground">
          Uptime {MOCK_KPI.uptime}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Camera feed placeholder ──────────────────────────────── */
function CameraFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-modal"
      style={{ aspectRatio: '16/9' }}
    >
      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent scan-line"
        />
      </div>

      {/* Corner brackets */}
      {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-6 h-6`}>
          <div className={cn(
            'absolute w-full h-full border-slate-400/40',
            i === 0 && 'border-l-2 border-t-2',
            i === 1 && 'border-r-2 border-t-2',
            i === 2 && 'border-l-2 border-b-2',
            i === 3 && 'border-r-2 border-b-2',
          )} />
        </div>
      ))}

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-slate-600 text-xs font-mono uppercase tracking-widest mb-2">
          Gate A · Cam 1
        </div>
        <div className="text-slate-500 text-xs font-mono data-updating">
          Awaiting RTSP stream...
        </div>
      </div>

      {/* Top info bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white text-xs font-mono font-medium">LIVE</span>
        </div>
        <div className="text-white/60 text-xs font-mono">
          {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      {/* Bottom detection overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          <div className="text-white text-xs font-mono">FPS: 30.2</div>
          <div className="text-white/60 text-xs font-mono">1920 × 1080</div>
          <div className="text-emerald-400 text-xs font-mono">DETECTING</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Live Detection Panel ────────────────────────────────── */
function DetectionPanel() {
  const latest = MOCK_VEHICLES[0];
  const fields = [
    { label: 'Vehicle ID',   value: latest.id },
    { label: 'Type',         value: latest.type },
    { label: 'State',        value: latest.state },
    { label: 'Confidence',   value: `${(latest.confidence * 100).toFixed(1)}%` },
    { label: 'OCR Number',   value: latest.ocrNumber },
    { label: 'Gate',         value: latest.gate },
    { label: 'Frame #',      value: latest.frameNumber.toLocaleString() },
    { label: 'Inference',    value: `${latest.inferenceMs} ms` },
    { label: 'BBox Conf',    value: `${(latest.bboxConf * 100).toFixed(1)}%` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="text-sm font-semibold">Live Detection</div>
        <span className="live-dot text-xs text-muted-foreground">Updating</span>
      </div>
      <div className="divide-y divide-border">
        {fields.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-5 py-2.5">
            <span className="label-xs">{label}</span>
            <span className={cn(
              'text-xs font-mono font-medium',
              label === 'State' && value === 'Loaded' ? 'text-success' :
              label === 'State' && value === 'Empty'  ? 'text-muted-foreground' :
              'text-foreground'
            )}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Recent detections ───────────────────────────────────── */
function RecentDetections() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="text-sm font-semibold">Recent Detections</div>
        <span className="label-xs text-brand">View all</span>
      </div>
      <div className="divide-y divide-border">
        {MOCK_VEHICLES.slice(0, 5).map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.35 + i * 0.06 }}
            className="flex items-center justify-between px-5 py-3 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn(
                'w-2 h-2 rounded-full flex-shrink-0',
                v.state === 'Loaded' ? 'bg-success' : 'bg-muted-foreground'
              )} />
              <div className="min-w-0">
                <div className="text-xs font-mono font-semibold text-foreground truncate">{v.id}</div>
                <div className="text-[10px] text-muted-foreground">{v.camera}</div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <div className={cn(
                'text-[10px] font-semibold',
                v.state === 'Loaded' ? 'text-success' : 'text-muted-foreground'
              )}>
                {v.state}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">
                {(v.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */
export default function Dashboard() {
  const kpis = [
    { label: 'Total Detected', value: MOCK_KPI.totalDetected.toLocaleString(), icon: Truck, sub: 'Today' },
    { label: 'Loaded',         value: MOCK_KPI.loadedCount.toLocaleString(),   icon: Box,   sub: `${((MOCK_KPI.loadedCount / MOCK_KPI.totalDetected) * 100).toFixed(0)}% of total` },
    { label: 'Empty',          value: MOCK_KPI.emptyCount.toLocaleString(),    icon: Box,   sub: `${((MOCK_KPI.emptyCount  / MOCK_KPI.totalDetected) * 100).toFixed(0)}% of total` },
    { label: 'Avg Accuracy',   value: `${MOCK_KPI.avgAccuracy}%`,              icon: Target,sub: 'Detection confidence' },
  ];

  return (
    <DashboardLayout title="AI Monitoring Console">
      <WelcomeStrip />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k, i) => (
          <KpiCard key={k.label} {...k} delay={0.05 + i * 0.07} />
        ))}
      </div>

      {/* Main layout — camera 65% / right panel 35% */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Camera + detection info */}
        <div className="xl:col-span-2 space-y-4">
          <CameraFeed />
          <DetectionPanel />
        </div>

        {/* Right panel */}
        <div className="xl:col-span-1 space-y-4">
          <RecentDetections />

          {/* Active alerts mini */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div className="text-sm font-semibold">Active Alerts</div>
              <span className="text-[10px] font-semibold text-error">{MOCK_ALERTS.length} active</span>
            </div>
            <div className="divide-y divide-border">
              {MOCK_ALERTS.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                  className="flex items-start gap-3 px-5 py-3"
                >
                  <AlertTriangle className={cn(
                    'w-3.5 h-3.5 mt-0.5 flex-shrink-0',
                    alert.severity === 'error' ? 'text-error' :
                    alert.severity === 'warning' ? 'text-warning' : 'text-info'
                  )} />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-foreground">{alert.title}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{alert.message}</div>
                    <div className="text-[10px] text-muted-foreground/60 mt-1">{alert.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
