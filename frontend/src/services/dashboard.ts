import apiClient from '@/lib/apiClient';
import { DashboardStats, AnalyticsThroughput } from '@/types/api';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await apiClient.get('/dashboard/stats');
  return data;
};

export const getAnalytics = async (): Promise<AnalyticsThroughput[]> => {
  const { data } = await apiClient.get('/dashboard/analytics/throughput');
  return data;
};

export const getReports = async (): Promise<any> => {
  const { data } = await apiClient.get('/dashboard/reports');
  return data;
};
