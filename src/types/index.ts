export interface Unit {
  id: string;
  building_id: string;
  floor: number;
  unit_number: string;
  size: number;
  price_per_sqm: number;
  total_price: number;
  status: 'available' | 'occupied' | 'reserved';
  condition: 'bare' | 'semi-fitted' | 'fully-fitted';
  description?: string;
  amenities?: string[];
  images?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Building {
  id: string;
  name: string;
  address: string;
  description: string;
  total_floors: number;
  year_built: number;
  total_area: number;
  parking_slots: number;
  amenities: string[];
  images: string[];
  location: {
    lat: number;
    lng: number;
  };
  created_at?: string;
  updated_at?: string;
}

export interface Appointment {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
  unit_id?: string;
  building_id?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  created_at?: string;
}

export interface FinancialReport {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: 'pdf' | 'excel' | 'word';
  category: 'quarterly' | 'annual' | 'monthly';
  year: number;
  quarter?: number;
  month?: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'viewer';
  created_at: string;
  last_login?: string;
}

export interface SearchFilters {
  building?: string;
  condition?: string;
  minSize?: number;
  maxSize?: number;
  minPrice?: number;
  maxPrice?: number;
  floor?: number;
  status?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
