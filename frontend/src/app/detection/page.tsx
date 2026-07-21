'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Upload, Activity, Zap, CheckCircle2, AlertTriangle, Crosshair, Film, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUploadDetection, useUploadVideoDetection } from '@/hooks/useDetections';
import { AiDetectionResult, VideoDetectionResponse } from '@/types/api';

export default function Detection() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AiDetectionResult | null>(null);
  const [videoResult, setVideoResult] = useState<VideoDetectionResponse | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: detectImage, isPending: isImagePending, error: imageError } = useUploadDetection();
  const { mutate: detectVideo, isPending: isVideoPending, error: videoError } = useUploadVideoDetection();

  const isPending = isImagePending || isVideoPending;
  const error = imageError || videoError;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setResult(null);
      setVideoResult(null);
      
      const isVideoFile = selected.type.startsWith('video/') || selected.name.match(/\.(mp4|avi|mov|mkv)$/i) !== null;
      setIsVideo(isVideoFile);

      if (isVideoFile) {
        setPreview(URL.createObjectURL(selected));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selected);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDetect = () => {
    if (!file) return;
    if (isVideo) {
      detectVideo(file, {
        onSuccess: (data) => setVideoResult(data),
      });
    } else {
      detectImage(file, {
        onSuccess: (data) => setResult(data),
      });
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setVideoResult(null);
    setIsVideo(false);
  };

  return (
    <DashboardLayout title={isVideo ? "Video Detection" : "Single Image Detection"}>
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-6 gap-4">
        <div>
          <h1 className="text-display-sm font-semibold tracking-tight">Manual Inspection</h1>
          <p className="mt-1 text-body-sm text-muted-foreground">Upload an image or video to run a one-off AI analysis.</p>
        </div>
        <div className="flex items-center gap-3">
          {file && (
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleDetect}
            disabled={!file || isPending}
            className="px-6 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isPending ? (
              <span className="flex items-center gap-2"><Activity className="w-4 h-4 animate-pulse" /> Processing...</span>
            ) : (
              <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Run Detection</span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Upload & Viewer Area */}
        <div className="xl:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl border border-border bg-card overflow-hidden"
            style={{ minHeight: '500px' }}
          >
            {!preview ? (
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-border m-4 rounded-xl hover:bg-muted/30 hover:border-foreground/30 transition-all cursor-pointer"
                onClick={handleUploadClick}
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="text-sm font-semibold">Click to upload image or video</div>
                <div className="text-xs text-muted-foreground mt-1">JPEG, PNG, MP4, AVI, MOV up to 500MB</div>
              </div>
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4 min-h-[500px]">
                {isVideo ? (
                  <div className="w-full h-full flex flex-col items-center justify-center relative">
                    {videoResult ? (
                      <video 
                        src={`http://localhost:8000${videoResult.processed_video}`} 
                        controls 
                        className="max-w-full max-h-[600px] object-contain rounded border border-slate-800"
                        autoPlay
                      />
                    ) : (
                      <video 
                        src={preview} 
                        controls 
                        className="max-w-full max-h-[600px] object-contain rounded border border-slate-800 opacity-50"
                      />
                    )}
                  </div>
                ) : (
                  <div className="relative inline-block max-w-full max-h-full">
                    <img src={preview} alt="Upload preview" className="max-w-full max-h-[600px] object-contain rounded border border-slate-800" />
                    
                    {/* Bounding Boxes overlay */}
                    {result && result.ai_result.detections.map((det, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="absolute border-2 shadow-sm pointer-events-none"
                        style={{
                          left: `${det.bbox.x1}%`,
                          top: `${det.bbox.y1}%`,
                          width: `${det.bbox.x2 - det.bbox.x1}%`,
                          height: `${det.bbox.y2 - det.bbox.y1}%`,
                          borderColor: det.class.includes('loaded') ? '#10b981' : '#f59e0b',
                        }}
                      >
                        <div 
                          className="absolute -top-6 left-[-2px] px-2 py-0.5 text-[10px] font-mono font-bold text-black uppercase whitespace-nowrap"
                          style={{ backgroundColor: det.class.includes('loaded') ? '#10b981' : '#f59e0b' }}
                        >
                          {det.class.replace('_', ' ')} {(det.confidence * 100).toFixed(0)}%
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {isPending && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
                    <div className="relative w-24 h-24 mb-4">
                      <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
                      <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" />
                      <Crosshair className="absolute inset-0 m-auto w-8 h-8 text-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-emerald-400 font-mono text-sm tracking-widest uppercase animate-pulse">Running Inference...</div>
                    {isVideo && <div className="text-emerald-500/80 text-xs mt-2 font-mono">This may take a while depending on video length</div>}
                  </div>
                )}
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden" />
          </motion.div>
          
          {/* Download Annotated Video Button */}
          {videoResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
              <a 
                href={`http://localhost:8000${videoResult.processed_video}`} 
                download
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" /> Download Annotated Video
              </a>
            </motion.div>
          )}
        </div>

        {/* Results Panel */}
        <div className="xl:col-span-1 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <div className="text-sm font-semibold">Inspection Results</div>
              {isVideo && <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-wider">Video</span>}
            </div>
            
            {!result && !videoResult && !isPending && !error && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Upload a file and run detection to see results here.
              </div>
            )}
            
            {error && (
              <div className="p-5 text-sm text-red-500 bg-red-50 dark:bg-red-950/20">
                Failed to process file. Make sure the AI Engine is running.
              </div>
            )}

            {/* Image Results */}
            {result && !isVideo && (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="divide-y divide-border">
                  <div className="p-5 bg-muted/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Status</div>
                      {result.ai_result.success ? (
                        <div className="flex items-center gap-1.5 text-success text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4" /> Successful
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-error text-xs font-semibold">
                          <AlertTriangle className="w-4 h-4" /> Failed
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-1">Processing Time</div>
                        <div className="text-sm font-mono font-medium">{result.ai_result.processing_time_ms} ms</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-1">Objects Found</div>
                        <div className="text-sm font-mono font-medium">{result.ai_result.detections.length}</div>
                      </div>
                    </div>
                  </div>

                  {result.ai_result.detections.length > 0 ? (
                    <div className="max-h-[350px] overflow-y-auto">
                      {result.ai_result.detections.map((det, idx) => (
                        <div key={idx} className="flex items-center justify-between px-5 py-3 hover:bg-muted/40">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              det.class.includes('loaded') ? 'bg-success' : 'bg-warning'
                            )} />
                            <div>
                              <div className="text-xs font-semibold capitalize">{det.class.replace('_', ' ')}</div>
                              <div className="text-[10px] text-muted-foreground">Detection #{idx + 1}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-mono font-semibold">{(det.confidence * 100).toFixed(1)}%</div>
                            <div className="text-[10px] text-muted-foreground">Confidence</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-5 text-center text-sm text-muted-foreground">
                      No vehicles detected in this image.
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Video Results */}
            {videoResult && isVideo && (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="divide-y divide-border">
                  <div className="p-5 bg-muted/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Status</div>
                      <div className="flex items-center gap-1.5 text-success text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4" /> Successful
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-1">Processing Time</div>
                        <div className="text-sm font-mono font-medium">{(videoResult.ai_result.processing_time_ms / 1000).toFixed(2)} s</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-1">Avg Confidence</div>
                        <div className="text-sm font-mono font-medium">{(videoResult.ai_result.average_confidence * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-1">Frames</div>
                        <div className="text-sm font-mono font-medium">{videoResult.ai_result.frame_count}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-1">FPS</div>
                        <div className="text-sm font-mono font-medium">{videoResult.ai_result.fps}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-4">Estimated Objects</div>
                    {Object.keys(videoResult.ai_result.detection_summary).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(videoResult.ai_result.detection_summary).map(([cls, count], idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                cls.includes('loaded') ? 'bg-success' : 'bg-warning'
                              )} />
                              <div className="text-sm font-medium capitalize">{cls.replace('_', ' ')}</div>
                            </div>
                            <div className="text-sm font-mono font-bold">{count}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-sm text-muted-foreground py-4">
                        No vehicles detected in this video.
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
