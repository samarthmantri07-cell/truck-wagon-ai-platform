'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { MOCK_VEHICLES } from '@/constants/mockData';
import { cn } from '@/lib/utils';
import { Camera, StopCircle, Play, PhoneCall, AlertTriangle, Monitor, Wifi } from 'lucide-react';

type CameraSource = 'laptop' | 'rtsp';

export default function Live() {
  const [source, setSource] = useState<CameraSource>('laptop');
  const [running, setRunning] = useState(false);
  const [rtspUrl, setRtspUrl] = useState('rtsp://192.168.1.10:554/cam1');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(id);
  }, [running]);

  const currentVehicle = running ? MOCK_VEHICLES[tick % MOCK_VEHICLES.length] : null;

  return (
    <DashboardLayout title="Live Monitoring Feed">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-display-sm font-semibold tracking-tight">Live Monitoring</h1>
          <p className="mt-1 text-body-sm text-muted-foreground">Real-time AI detection feed.</p>
        </div>
        <div className="flex items-center gap-2">
          {running ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-semibold">
              <span className="live-dot" />
              AI Detecting
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
              Camera Off
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Camera Feed + Controls — 2/3 */}
        <div className="xl:col-span-2 space-y-4">
          {/* Camera Feed */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-modal" style={{ aspectRatio: '16/9' }}>
            {running && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent scan-line" />
              </div>
            )}

            {/* Corner brackets */}
            {(['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'] as const).map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-6 h-6`}>
                <div className={cn(
                  'absolute w-full h-full',
                  running ? 'border-emerald-500/60' : 'border-slate-600/30',
                  i === 0 && 'border-l-2 border-t-2',
                  i === 1 && 'border-r-2 border-t-2',
                  i === 2 && 'border-l-2 border-b-2',
                  i === 3 && 'border-r-2 border-b-2',
                )} />
              </div>
            ))}

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {running ? (
                <motion.div
                  key={tick}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="text-emerald-400 text-sm font-mono uppercase tracking-widest mb-2">
                    Detection Active
                  </div>
                  <div className="text-slate-500 text-xs font-mono">
                    {source === 'laptop' ? 'Laptop Camera' : rtspUrl}
                  </div>
                </motion.div>
              ) : (
                <div className="text-center">
                  <Camera className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <div className="text-slate-600 text-xs font-mono uppercase tracking-widest">Camera Offline</div>
                </div>
              )}
            </div>

            {/* Overlays */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-gradient-to-b from-black/70 to-transparent">
              <div className="flex items-center gap-2">
                <div className={cn('w-2 h-2 rounded-full', running ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600')} />
                <span className="text-white text-xs font-mono">{running ? 'LIVE' : 'OFF'}</span>
              </div>
              <div className="text-white/40 text-xs font-mono">
                {source === 'laptop' ? 'Laptop Camera' : 'RTSP'}
              </div>
            </div>

            {running && (
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white/60">FPS: 30.2</span>
                  <span className="text-emerald-400">AI: Active</span>
                  <span className="text-white/60">Frame: {(tick * 87 + 3800).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Camera source */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="label-xs mb-3">Camera Source</div>
              <div className="flex gap-2 mb-4">
                {(['laptop', 'rtsp'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSource(s)}
                    className={cn(
                      'flex-1 h-9 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2',
                      source === s
                        ? 'bg-foreground text-background'
                        : 'border border-border text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {s === 'laptop' ? <Monitor className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                    {s === 'laptop' ? 'Laptop' : 'RTSP'}
                  </button>
                ))}
              </div>
              {source === 'rtsp' && (
                <input
                  type="text"
                  value={rtspUrl}
                  onChange={e => setRtspUrl(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-muted/40 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              )}
            </div>

            {/* Action buttons */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="label-xs mb-3">Camera Controls</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setRunning(true)}
                  disabled={running}
                  className="h-9 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" /> Start
                </button>
                <button
                  onClick={() => { setRunning(false); setTick(0); }}
                  disabled={!running}
                  className="h-9 rounded-lg border border-border text-sm font-medium hover:bg-muted disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
                >
                  <StopCircle className="w-3.5 h-3.5" /> Stop
                </button>
                <button className="h-9 rounded-lg bg-error/10 text-error text-sm font-medium hover:bg-error/20 transition-colors col-span-2 flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Emergency Stop
                </button>
                <button className="h-9 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" /> Security
                </button>
                <button className="h-9 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" /> Supervisor
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — 1/3 */}
        <div className="xl:col-span-1 space-y-4">
          {/* Live Detection */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div className="text-sm font-semibold">Live Detection</div>
              {running && <span className="live-dot text-xs text-muted-foreground">Updating</span>}
            </div>
            {currentVehicle ? (
              <motion.div
                key={tick}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="divide-y divide-border"
              >
                {[
                  { label: 'Vehicle ID',  value: currentVehicle.id },
                  { label: 'Type',        value: currentVehicle.type },
                  { label: 'State',       value: currentVehicle.state },
                  { label: 'Confidence', value: `${(currentVehicle.confidence * 100).toFixed(1)}%` },
                  { label: 'OCR Number', value: currentVehicle.ocrNumber },
                  { label: 'Gate',       value: currentVehicle.gate },
                  { label: 'Frame #',    value: currentVehicle.frameNumber.toLocaleString() },
                  { label: 'Inference',  value: `${currentVehicle.inferenceMs} ms` },
                  { label: 'BBox Conf',  value: `${(currentVehicle.bboxConf * 100).toFixed(1)}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between px-5 py-2.5">
                    <span className="label-xs">{label}</span>
                    <span className={cn(
                      'text-xs font-mono font-medium',
                      label === 'State' && value === 'Loaded' ? 'text-success' :
                      label === 'State' ? 'text-muted-foreground' : 'text-foreground'
                    )}>{value}</span>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="px-5 py-12 text-center text-muted-foreground text-xs">
                Start the camera feed to see live detections
              </div>
            )}
          </div>

          {/* Recent events */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <div className="text-sm font-semibold">Event Stream</div>
            </div>
            <div className="divide-y divide-border max-h-64 overflow-y-auto">
              {MOCK_VEHICLES.map((v, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', v.state === 'Loaded' ? 'bg-success' : 'bg-muted-foreground')} />
                    <div className="min-w-0">
                      <div className="text-xs font-mono font-semibold truncate">{v.id}</div>
                      <div className="text-[10px] text-muted-foreground">{v.camera}</div>
                    </div>
                  </div>
                  <span className={cn('text-[10px] font-semibold', v.state === 'Loaded' ? 'text-success' : 'text-muted-foreground')}>
                    {v.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
