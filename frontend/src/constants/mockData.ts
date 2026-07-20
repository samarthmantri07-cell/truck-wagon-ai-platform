export const MOCK_VEHICLES = [
  { id: 'TRK-901', type: 'Truck', state: 'Loaded', confidence: 0.98, timestamp: '2026-07-20T10:15:30Z', camera: 'Gate A' },
  { id: 'WGN-204', type: 'Wagon', state: 'Empty', confidence: 0.95, timestamp: '2026-07-20T10:14:12Z', camera: 'Rail Yard 1' },
  { id: 'TRK-902', type: 'Truck', state: 'Empty', confidence: 0.99, timestamp: '2026-07-20T10:12:05Z', camera: 'Gate B' },
  { id: 'WGN-205', type: 'Wagon', state: 'Loaded', confidence: 0.88, timestamp: '2026-07-20T10:10:45Z', camera: 'Rail Yard 1' },
];

export const MOCK_KPI = {
  totalDetected: 1432,
  loadedCount: 845,
  emptyCount: 587,
  avgAccuracy: 96.4,
  systemFps: 30.2,
};

export const MOCK_CHART_DATA = [
  { time: '08:00', loaded: 40, empty: 24 },
  { time: '09:00', loaded: 30, empty: 13 },
  { time: '10:00', loaded: 20, empty: 38 },
  { time: '11:00', loaded: 27, empty: 39 },
  { time: '12:00', loaded: 18, empty: 48 },
  { time: '13:00', loaded: 23, empty: 38 },
  { time: '14:00', loaded: 34, empty: 43 },
];

export const MOCK_ALERTS = [
  { id: 1, type: 'Warning', message: 'Camera "Gate A" framerate dropped to 15 FPS.', time: '10 mins ago' },
  { id: 2, type: 'Error', message: 'Unauthorized vehicle detected at Loading Bay 4.', time: '1 hour ago' },
];
