import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getAnalytics, getReports } from '@/services/dashboard';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    refetchInterval: 5000,
  });
};

export const useAnalytics = () => {
  return useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: getAnalytics,
  });
};

export const useReports = () => {
  return useQuery({
    queryKey: ['dashboard-reports'],
    queryFn: getReports,
  });
};
