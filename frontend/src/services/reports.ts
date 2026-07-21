import apiClient from '@/lib/apiClient';

export interface Report {
  id: string;
  reportId: string;
  date: string;
  vehicleType: string;
  inspectionStatus: string;
  confidence: number;
  gateNumber: string;
  damage: boolean;
  emergency: boolean;
  filePath: string;
  createdAt: string;
}

export const getReports = async (): Promise<Report[]> => {
  const { data } = await apiClient.get('/reports');
  return data;
};

export const generateReport = async (): Promise<Report> => {
  const { data } = await apiClient.post('/reports/generate');
  return data;
};

export const getDownloadUrl = (filePath: string) => {
  const token = localStorage.getItem('token');
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  return `${baseUrl.replace('/api', '')}${filePath}?token=${token}`; // Wait, static files don't need token if served static, but we can just use the static path.
};
