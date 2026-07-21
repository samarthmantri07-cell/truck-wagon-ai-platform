'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Camera, StopCircle, Play, PhoneCall, AlertTriangle, Monitor, Wifi, Crosshair } from 'lucide-react';
import { predictStreamFrame } from '@/services/detections';
import { StreamDetectionResult } from '@/types/api';

type CameraSource = 'laptop' | 'rtsp';

export default function Live() {
  const [source, setSource] = useState<CameraSource>('laptop');
  const [running, setRunning] = useState(false);
  const [rtspUrl, setRtspUrl] = useState('rtsp://192.168.1.10:554/cam1');
  const [frameTick, setFrameTick] = useState(0);
  const [detections, setDetections] = useState<StreamDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const loopRef = useRef<number | null>(null);
  const processingRef = useRef<boolean>(false);
  
  // Real-time Event Stream
  const [events, setEvents] = useState<{ id: string, type: string, confidence: number, time: Date }[]>([]);

  // Start/Stop Camera
  useEffect(() => {
    if (running && source === 'laptop') {
      navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(err => {
          console.error("Error accessing webcam:", err);
          setError("Failed to access webcam.");
          setRunning(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [running, source]);

  // Frame Processing Loop
  useEffect(() => {
    if (!running) {
      if (loopRef.current) clearInterval(loopRef.current);
      return;
    }
    
    // Process a frame every 500ms (2 FPS) to avoid overloading the backend
    loopRef.current = window.setInterval(async () => {
      if (processingRef.current) return; // Wait for previous frame to finish
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) return;
      
      // Draw frame to hidden canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const base64Image = canvas.toDataURL('image/jpeg', 0.7);
      
      try {
        processingRef.current = true;
        const result = await predictStreamFrame(base64Image);
        setDetections(result);
        setFrameTick(f => f + 1);
        setError(null);
        
        // Add events
        if (result.success && result.detections.length > 0) {
          const newEvents = result.detections.map((d, i) => ({
            id: `EVT-${Date.now().toString().slice(-4)}-${i}`,
            type: d.class,
            confidence: d.confidence,
            time: new Date()
          }));
          
          setEvents(prev => [...newEvents, ...prev].slice(0, 20));
        }
      } catch (err) {
        console.error("Stream inference failed", err);
        // Don't show error immediately to avoid flickering on transient failures
      } finally {
        processingRef.current = false;
      }
    }, 500);
    
    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, [running]);

  const latestVehicle = detections?.detections?.[0];

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
          {error && (
            <div className="p-4 rounded-xl bg-error/10 text-error text-sm font-medium border border-error/20 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}
          
          {/* Camera Feed */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-modal" style={{ aspectRatio: '16/9' }}>
            {running && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
                <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent scan-line" />
              </div>
            )}

            {/* Video Element */}
            <video 
              ref={videoRef} 
              className={cn("absolute inset-0 w-full h-full object-cover", !running && "hidden")} 
              muted 
              playsInline
            />
            
            {/* Hidden Canvas for capturing frames */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Bounding Boxes Overlay */}
            {running && videoRef.current && detections && detections.success && (
              <div className="absolute inset-0 pointer-events-none z-10">
                {detections.detections.map((det, i) => {
                  // Normalize coordinates to percentages
                  const vw = videoRef.current!.videoWidth || 1;
                  const vh = videoRef.current!.videoHeight || 1;
                  
                  const left = (det.bbox.x1 / vw) * 100;
                  const top = (det.bbox.y1 / vh) * 100;
                  const width = ((det.bbox.x2 - det.bbox.x1) / vw) * 100;
                  const height = ((det.bbox.y2 - det.bbox.y1) / vh) * 100;
                  
                  const color = det.class.includes('loaded') ? '#10b981' : '#f59e0b';
                  
                  return (
                    <motion.div
                      key={`${frameTick}-${i}`}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="absolute border-2 shadow-sm"
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        width: `${width}%`,
                        height: `${height}%`,
                        borderColor: color,
                      }}
                    >
                      <div 
                        className="absolute -top-6 left-[-2px] px-2 py-0.5 text-[10px] font-mono font-bold text-black uppercase whitespace-nowrap"
                        style={{ backgroundColor: color }}
                      >
                        {det.class.replace('_', ' ')} {(det.confidence * 100).toFixed(0)}%
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Corner brackets */}
            {(['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'] as const).map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-6 h-6 z-20 pointer-events-none`}>
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

            {!running && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-center">
                  <Camera className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <div className="text-slate-600 text-xs font-mono uppercase tracking-widest">Camera Offline</div>
                </div>
              </div>
            )}

            {/* Overlays */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-gradient-to-b from-black/70 to-transparent z-30 pointer-events-none">
              <div className="flex items-center gap-2">
                <div className={cn('w-2 h-2 rounded-full', running ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600')} />
                <span className="text-white text-xs font-mono">{running ? 'LIVE' : 'OFF'}</span>
              </div>
              <div className="text-white/40 text-xs font-mono">
                {source === 'laptop' ? 'Laptop Camera' : 'RTSP'}
              </div>
            </div>

            {running && (
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent z-30 pointer-events-none">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white/60">Frames Evaluated: {frameTick.toLocaleString()}</span>
                  <span className="text-emerald-400">AI: Active</span>
                  <span className="text-white/60">{detections ? `${detections.processing_time_ms}ms/frame` : 'Awaiting inference...'}</span>
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
                    onClick={() => {
                      setSource(s);
                      if (s === 'rtsp') {
                        setError("RTSP playback in browsers requires a backend WebRTC proxy. Simulating connection...");
                        setRunning(false);
                      } else {
                        setError(null);
                      }
                    }}
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
                  disabled={running || source === 'rtsp'}
                  className="h-9 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" /> Start
                </button>
                <button
                  onClick={() => { setRunning(false); setFrameTick(0); setDetections(null); }}
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
              <div className="text-sm font-semibold">Latest Target</div>
              {running && <span className="live-dot text-xs text-muted-foreground">Updating</span>}
            </div>
            {running && latestVehicle ? (
              <motion.div
                key={frameTick}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="divide-y divide-border"
              >
                {[
                  { label: 'Type',        value: latestVehicle.class.replace('_', ' ').toUpperCase() },
                  { label: 'State',       value: latestVehicle.class.includes('loaded') ? 'LOADED' : 'EMPTY' },
                  { label: 'Confidence', value: `${(latestVehicle.confidence * 100).toFixed(1)}%` },
                  { label: 'Camera',     value: source === 'laptop' ? 'CAM_LPT_01' : 'CAM_RTSP_01' },
                  { label: 'Processing',  value: `${detections?.processing_time_ms} ms` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between px-5 py-2.5">
                    <span className="label-xs">{label}</span>
                    <span className={cn(
                      'text-xs font-mono font-medium',
                      label === 'State' && value === 'LOADED' ? 'text-success' :
                      label === 'State' ? 'text-warning' : 'text-foreground'
                    )}>{value}</span>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="px-5 py-12 text-center text-muted-foreground text-xs">
                {running ? (
                  <div className="flex flex-col items-center gap-2">
                    <Crosshair className="w-6 h-6 text-muted-foreground/40 animate-pulse" />
                    Scanning for vehicles...
                  </div>
                ) : 'Start the camera feed to see live detections'}
              </div>
            )}
          </div>

          {/* Recent events */}
          <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col max-h-[350px]">
            <div className="px-5 py-4 border-b border-border">
              <div className="text-sm font-semibold">Event Stream</div>
            </div>
            <div className="divide-y divide-border overflow-y-auto flex-1">
              {events.length > 0 ? (
                <AnimatePresence>
                  {events.map((v) => (
                    <motion.div 
                      key={v.id} 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-center justify-between px-5 py-3 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', v.type.includes('loaded') ? 'bg-success' : 'bg-warning')} />
                        <div className="min-w-0">
                          <div className="text-xs font-mono font-semibold truncate uppercase">{v.id}</div>
                          <div className="text-[10px] text-muted-foreground">{v.time.toLocaleTimeString()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn('text-[10px] font-semibold uppercase tracking-wider', v.type.includes('loaded') ? 'text-success' : 'text-warning')}>
                          {v.type.replace('_', ' ')}
                        </span>
                        <div className="text-[10px] text-muted-foreground">{(v.confidence * 100).toFixed(0)}%</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="p-5 text-center text-xs text-muted-foreground">No recent events</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
