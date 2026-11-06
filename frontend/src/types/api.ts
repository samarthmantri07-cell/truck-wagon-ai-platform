export interface AuthResponse {
  id: string;
  username: string;
  role: string;
  token: string;
}

export interface DashboardStats {
  total_detections: number;
  loaded: number;
  empty: number;
  active_cameras: number;
  system_uptime: string;
}

export interface AnalyticsThroughput {
  time: string;
  loaded: number;
  empty: number;
}

export interface DetectionObject {
  id: string;
  className: string;
  confidence: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface UploadObj {
  id: string;
  filePath: string;
}

export interface DetectionItem {
  id: string;
  uploadId: string;
  processingTimeMs: number;
  success: boolean;
  createdAt: string;
  upload: UploadObj;
  objects: DetectionObject[];
}

export interface DetectionResponse {
  data: DetectionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StreamDetectionResult {
  success: boolean;
  processing_time_ms: number;
  detections: Array<{
    class_name: string;
    confidence: number;
    bbox: { x1: number; y1: number; x2: number; y2: number };
  }>;
}

export interface AiDetectionResult {
  id: string;
  image_path: string;
  ai_result: StreamDetectionResult;
}

export interface AiVideoResult {
  output_path: string;
  processing_time_ms: number;
  frame_count: number;
  fps: number;
  average_confidence: number;
  detection_summary: Record<string, number>;
}

export interface VideoDetectionResponse {
  id: string;
  video_path: string;
  processed_video: string;
  ai_result: AiVideoResult;
}
