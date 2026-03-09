import { apiClient } from '../client';
import { API_CONFIG } from '@/config/api.config';
import type { Building, ApiResponse } from '@/types';

export const buildingsService = {
  async getAll(): Promise<ApiResponse<Building[]>> {
    return apiClient.get<Building[]>(API_CONFIG.ENDPOINTS.BUILDINGS);
  },

  async getById(id: string): Promise<ApiResponse<Building>> {
    return apiClient.get<Building>(`${API_CONFIG.ENDPOINTS.BUILDINGS}/${id}`);
  },

  async create(building: Omit<Building, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Building>> {
    return apiClient.post<Building>(API_CONFIG.ENDPOINTS.BUILDINGS, building);
  },

  async update(id: string, building: Partial<Building>): Promise<ApiResponse<Building>> {
    return apiClient.put<Building>(`${API_CONFIG.ENDPOINTS.BUILDINGS}/${id}`, building);
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${API_CONFIG.ENDPOINTS.BUILDINGS}/${id}`);
  },
};
