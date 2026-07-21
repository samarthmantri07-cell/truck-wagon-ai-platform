import apiClient from '@/lib/apiClient';
import { DetectionResponse, AiDetectionResult, VideoDetectionResponse, StreamDetectionResult } from '@/types/api';

export const uploadAndDetect = async (file: File): Promise<AiDetectionResult> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const { data } = await apiClient.post('/detections/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const uploadVideoDetection = async (file: File): Promise<VideoDetectionResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const { data } = await apiClient.post('/detections/video/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 300000 // 5 minutes for video processing
  });
  
  return data;
};

export const getDetections = async (params: { page?: number; limit?: number; search?: string; className?: string; success?: boolean; sortBy?: string; order?: string }): Promise<DetectionResponse> => {
  const { data } = await apiClient.get('/detections', { params });
  return data;
};

export const predictStreamFrame = async (imageBase64: string): Promise<StreamDetectionResult> => {
  const { data } = await apiClient.post('/detections/stream/frame', {
    image: imageBase64
  });
  return data;
};
