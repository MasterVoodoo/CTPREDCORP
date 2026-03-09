import { apiClient } from '../client';
import { API_CONFIG } from '@/config/api.config';
import type { Unit, ApiResponse, SearchFilters } from '@/types';

export const unitsService = {
  async getAll(filters?: SearchFilters): Promise<ApiResponse<Unit[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString 
      ? `${API_CONFIG.ENDPOINTS.UNITS}?${queryString}`
      : API_CONFIG.ENDPOINTS.UNITS;
    
    return apiClient.get<Unit[]>(endpoint);
  },

  async getById(id: string): Promise<ApiResponse<Unit>> {
    return apiClient.get<Unit>(`${API_CONFIG.ENDPOINTS.UNITS}/${id}`);
  },

  async getByBuilding(buildingId: string): Promise<ApiResponse<Unit[]>> {
    return apiClient.get<Unit[]>(`${API_CONFIG.ENDPOINTS.UNITS}/building/${buildingId}`);
  },

  async getByFloor(buildingId: string, floor: number): Promise<ApiResponse<Unit[]>> {
    return apiClient.get<Unit[]>(`${API_CONFIG.ENDPOINTS.UNITS}/building/${buildingId}/floor/${floor}`);
  },

  async create(unit: Omit<Unit, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Unit>> {
    return apiClient.post<Unit>(API_CONFIG.ENDPOINTS.UNITS, unit);
  },

  async update(id: string, unit: Partial<Unit>): Promise<ApiResponse<Unit>> {
    return apiClient.put<Unit>(`${API_CONFIG.ENDPOINTS.UNITS}/${id}`, unit);
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${API_CONFIG.ENDPOINTS.UNITS}/${id}`);
  },
};
