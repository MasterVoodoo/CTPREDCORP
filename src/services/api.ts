// API Service for fetching data from the backend MySQL database

// Get API base URL from environment variable
const getAPIBaseURL = () => {
  const envURL = import.meta.env.VITE_API_URL;
  
  // If env URL already includes /api, use it as is
  if (envURL && envURL.includes('/api')) {
    return envURL;
  }
  
  // If env URL is just the base (e.g., http://localhost:5000), add /api
  if (envURL) {
    return `${envURL}/api`;
  }
  
  // Default fallback
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getAPIBaseURL();

console.log('🔗 API Base URL:', API_BASE_URL);

// Helper function for API calls
async function fetchAPI(endpoint: string, options?: RequestInit) {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  
  console.log('📡 Fetching:', url);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error ${response.status}:`, errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ API Response:', data);
    return data;
  } catch (error) {
    console.error(`❌ Error fetching ${endpoint}:`, error);
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

// ===== HEALTH CHECK =====

export async function checkAPIHealth() {
  return fetchAPI('/health');
}
