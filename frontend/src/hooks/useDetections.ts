import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDetections, uploadAndDetect, uploadVideoDetection } from '@/services/detections';

export const useDetectionsHistory = (params: { page?: number; limit?: number; search?: string; className?: string; success?: boolean; sortBy?: string; order?: string } = {}) => {
  return useQuery({
    queryKey: ['detections-history', params],
    queryFn: () => getDetections(params),
    refetchInterval: 10000,
  });
};

export const useUploadDetection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => uploadAndDetect(file),
    onSuccess: () => {
      // Invalidate both dashboard stats and detections history
      queryClient.invalidateQueries({ queryKey: ['detections-history'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};

export const useUploadVideoDetection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => uploadVideoDetection(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detections-history'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};
