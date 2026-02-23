// API Service for fetching data from the backend MySQL database

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function for API calls
async function fetchAPI(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// ===== BUILDING API CALLS =====

export async function fetchAllBuildings() {
  return fetchAPI('/buildings');
}

export async function fetchBuildingById(buildingId: string) {
  return fetchAPI(`/buildings/${buildingId}`);
}

export async function fetchBuildingUnits(buildingId: string) {
  return fetchAPI(`/buildings/${buildingId}/units`);
}

// ===== UNIT API CALLS =====

export async function fetchAllUnits() {
  return fetchAPI('/units');
}

export async function fetchUnitById(unitId: string) {
  return fetchAPI(`/units/${unitId}`);
}

export async function fetchUnitsByBuilding(buildingId: string) {
  return fetchAPI(`/units/building/${buildingId}`);
}

export async function fetchUnitsByStatus(status: 'Available' | 'Coming Soon' | 'Taken') {
  return fetchAPI(`/units/status/${status}`);
}

export async function searchUnits(criteria: {
  buildingId?: string;
  floor?: number;
  minSize?: number;
  maxSize?: number;
  maxPrice?: number | string;
  status?: 'Available' | 'Coming Soon' | 'Taken';
}) {
  return fetchAPI('/units/search', {
    method: 'POST',
    body: JSON.stringify(criteria),
  });
}

// ===== ADMIN API CALLS =====

export async function fetchAllUnitsIncludingUnavailable() {
  return fetchAPI('/units/admin/all');
}
