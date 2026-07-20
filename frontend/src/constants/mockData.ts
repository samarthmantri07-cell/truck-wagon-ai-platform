export interface Vehicle {
  id: string;
  type: 'Truck' | 'Wagon';
  state: 'Loaded' | 'Empty';
  confidence: number;
  ocrNumber: string;
  timestamp: string;
  camera: string;
  gate: string;
  frameNumber: number;
  inferenceMs: number;
  bboxConf: number;
}

export interface Alert {
  id: number;
  severity: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
}

export interface ChartPoint {
  time: string;
  loaded: number;
  empty: number;
  accuracy: number;
}

export interface Camera {
  id: string;
  name: string;
  gate: string;
  status: 'online' | 'offline' | 'warning';
  fps: number;
  resolution: string;
  rtspUrl: string;
}

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'TRK-901', type: 'Truck', state: 'Loaded', confidence: 0.982, ocrNumber: 'MH12AB1234', timestamp: '2026-07-20T10:15:30Z', camera: 'Gate A – Cam 1', gate: 'Gate A', frameNumber: 3847, inferenceMs: 28, bboxConf: 0.971 },
  { id: 'WGN-204', type: 'Wagon', state: 'Empty',  confidence: 0.951, ocrNumber: 'WGN-204-E',  timestamp: '2026-07-20T10:14:12Z', camera: 'Rail Yard 1', gate: 'Rail Yard', frameNumber: 3831, inferenceMs: 31, bboxConf: 0.944 },
  { id: 'TRK-902', type: 'Truck', state: 'Empty',  confidence: 0.997, ocrNumber: 'GJ01XY9988', timestamp: '2026-07-20T10:12:05Z', camera: 'Gate B – Cam 2', gate: 'Gate B', frameNumber: 3803, inferenceMs: 26, bboxConf: 0.993 },
  { id: 'WGN-205', type: 'Wagon', state: 'Loaded', confidence: 0.883, ocrNumber: 'WGN-205-L',  timestamp: '2026-07-20T10:10:45Z', camera: 'Rail Yard 1', gate: 'Rail Yard', frameNumber: 3779, inferenceMs: 34, bboxConf: 0.871 },
  { id: 'TRK-903', type: 'Truck', state: 'Loaded', confidence: 0.965, ocrNumber: 'DL04CD5678', timestamp: '2026-07-20T10:08:22Z', camera: 'Gate A – Cam 2', gate: 'Gate A', frameNumber: 3754, inferenceMs: 29, bboxConf: 0.958 },
  { id: 'TRK-904', type: 'Truck', state: 'Empty',  confidence: 0.978, ocrNumber: 'KA05EF7654', timestamp: '2026-07-20T10:06:10Z', camera: 'Gate C – Cam 1', gate: 'Gate C', frameNumber: 3730, inferenceMs: 27, bboxConf: 0.969 },
  { id: 'WGN-206', type: 'Wagon', state: 'Loaded', confidence: 0.921, ocrNumber: 'WGN-206-L',  timestamp: '2026-07-20T10:04:55Z', camera: 'Rail Yard 2', gate: 'Rail Yard', frameNumber: 3712, inferenceMs: 32, bboxConf: 0.914 },
  { id: 'TRK-905', type: 'Truck', state: 'Loaded', confidence: 0.993, ocrNumber: 'RJ14GH2468', timestamp: '2026-07-20T10:02:30Z', camera: 'Gate B – Cam 1', gate: 'Gate B', frameNumber: 3695, inferenceMs: 25, bboxConf: 0.988 },
];

export const MOCK_KPI = {
  totalDetected: 1432,
  loadedCount: 845,
  emptyCount: 587,
  avgAccuracy: 96.4,
  systemFps: 30.2,
  uptime: '99.8%',
  activeCameras: 6,
  gatesMonitored: 4,
};

export const MOCK_CHART_DATA: ChartPoint[] = [
  { time: '06:00', loaded: 12, empty: 8,  accuracy: 95.1 },
  { time: '07:00', loaded: 28, empty: 14, accuracy: 96.2 },
  { time: '08:00', loaded: 40, empty: 24, accuracy: 97.0 },
  { time: '09:00', loaded: 35, empty: 19, accuracy: 96.8 },
  { time: '10:00', loaded: 43, empty: 27, accuracy: 97.4 },
  { time: '11:00', loaded: 38, empty: 22, accuracy: 96.9 },
  { time: '12:00', loaded: 29, empty: 33, accuracy: 96.1 },
  { time: '13:00', loaded: 22, empty: 28, accuracy: 95.8 },
  { time: '14:00', loaded: 34, empty: 25, accuracy: 96.5 },
  { time: '15:00', loaded: 47, empty: 18, accuracy: 97.8 },
  { time: '16:00', loaded: 51, empty: 21, accuracy: 97.5 },
];

export const MOCK_ALERTS: Alert[] = [
  { id: 1, severity: 'error',   title: 'Unauthorized Vehicle', message: 'Unknown vehicle at Loading Bay 4 — Gate B.', time: '2 min ago' },
  { id: 2, severity: 'warning', title: 'Camera Frame Drop', message: 'Gate A – Cam 1 dropped to 12 FPS.', time: '18 min ago' },
  { id: 3, severity: 'info',    title: 'Shift Change', message: 'Morning shift handover complete. Evening shift active.', time: '1 hr ago' },
  { id: 4, severity: 'warning', title: 'Model Confidence Low', message: 'Wagon WGN-208 detected with 74% confidence.', time: '2 hr ago' },
];

export const MOCK_CAMERAS: Camera[] = [
  { id: 'CAM-001', name: 'Gate A – Cam 1', gate: 'Gate A', status: 'online',  fps: 30,   resolution: '1920×1080', rtspUrl: 'rtsp://192.168.1.10:554/cam1' },
  { id: 'CAM-002', name: 'Gate A – Cam 2', gate: 'Gate A', status: 'online',  fps: 30,   resolution: '1920×1080', rtspUrl: 'rtsp://192.168.1.11:554/cam2' },
  { id: 'CAM-003', name: 'Gate B – Cam 1', gate: 'Gate B', status: 'online',  fps: 29.8, resolution: '1920×1080', rtspUrl: 'rtsp://192.168.1.12:554/cam3' },
  { id: 'CAM-004', name: 'Gate B – Cam 2', gate: 'Gate B', status: 'warning', fps: 12,   resolution: '1280×720',  rtspUrl: 'rtsp://192.168.1.13:554/cam4' },
  { id: 'CAM-005', name: 'Rail Yard 1',    gate: 'Rail Yard', status: 'online',  fps: 30,   resolution: '1920×1080', rtspUrl: 'rtsp://192.168.1.20:554/cam5' },
  { id: 'CAM-006', name: 'Rail Yard 2',    gate: 'Rail Yard', status: 'offline', fps: 0,    resolution: '1920×1080', rtspUrl: 'rtsp://192.168.1.21:554/cam6' },
];

export const MOCK_EMPLOYEE = {
  id: 'EMP-1047',
  name: 'Samar Khan',
  designation: 'Shift Supervisor',
  gate: 'Gate A',
  shift: 'Morning Shift — 06:00 to 14:00',
  email: 'samar.khan@enterprise.com',
  phone: '+91 98765 43210',
  avatarInitials: 'SK',
};
