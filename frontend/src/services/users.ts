import apiClient from '@/lib/apiClient';

export interface User {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

export const getUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get('/users');
  return data;
};

export const createUser = async (userData: any): Promise<User> => {
  const { data } = await apiClient.post('/users', userData);
  return data;
};

export const updateUser = async (id: string, userData: any): Promise<User> => {
  const { data } = await apiClient.put(`/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id: string): Promise<any> => {
  const { data } = await apiClient.delete(`/users/${id}`);
  return data;
};
