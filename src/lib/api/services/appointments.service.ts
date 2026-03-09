import { apiClient } from '../client';
import { API_CONFIG } from '@/config/api.config';
import type { Appointment, ApiResponse } from '@/types';

export const appointmentsService = {
  async create(appointment: Omit<Appointment, 'id' | 'status' | 'created_at'>): Promise<ApiResponse<Appointment>> {
    return apiClient.post<Appointment>(`${API_CONFIG.ENDPOINTS.EMAIL}/send-appointment`, appointment);
  },

  async getAll(): Promise<ApiResponse<Appointment[]>> {
    return apiClient.get<Appointment[]>(API_CONFIG.ENDPOINTS.APPOINTMENTS);
  },

  async getById(id: string): Promise<ApiResponse<Appointment>> {
    return apiClient.get<Appointment>(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${id}`);
  },

  async updateStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<ApiResponse<Appointment>> {
    return apiClient.patch<Appointment>(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${id}/status`, { status });
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${id}`);
  },
};
