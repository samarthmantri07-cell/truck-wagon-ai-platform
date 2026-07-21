import apiClient from '@/lib/apiClient';
import { AuthResponse } from '@/types/api';

export const login = async (credentials: any): Promise<AuthResponse> => {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data;
};

export const register = async (userData: any): Promise<AuthResponse> => {
  const { data } = await apiClient.post('/auth/register', userData);
  return data;
};
