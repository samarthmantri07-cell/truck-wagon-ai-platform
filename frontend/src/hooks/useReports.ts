import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReports, generateReport } from '@/services/reports';

export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: getReports,
  });
};

export const useGenerateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
