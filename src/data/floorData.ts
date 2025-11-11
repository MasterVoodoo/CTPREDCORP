// ===== FLOOR RELATED TYPES =====
export interface BuildingFloorPlan {
  floor: number;
  units: number;
  totalSqft: number;
  available: number;
  condition: "Bare" | "Warm Shell" | "Fitted";
}

export interface FloorInfo {
  buildingId: string;
  floor: number;
  totalArea: number;
  availableUnits: number;
  totalUnits: number;
  condition: "Bare" | "Warm Shell" | "Fitted";
  features: string[];
  description: string;
}

// ===== FLOOR DATA =====
export const buildingFloorPlans: { [buildingId: string]: BuildingFloorPlan[] } = {
  "ctp-red-corp": [
    { floor: 1, units: 1, totalSqft: 1200, available: 1, condition: "Fitted" }
  ],
  "ctp-alpha-tower": [
    { floor: 1, units: 1, totalSqft: 1400, available: 1, condition: "Warm Shell" }
  ],
  "ctp-bf-building": [
    { floor: 1, units: 1, totalSqft: 1300, available: 1, condition: "Bare" }
  ]
};

export const floorDetails: { [key: string]: FloorInfo } = {
  "ctp-red-corp-1": {
    buildingId: "ctp-red-corp",
    floor: 1,
    totalArea: 1200,
    availableUnits: 1,
    totalUnits: 1,
    condition: "Fitted",
    features: [
      "Premium finishes installed",
      "Ready-to-move workspace",
      "Professional lighting system",
      "Climate-controlled environment",
      "High-speed internet ready",
      "Security access integrated"
    ],
    description: "Fully fitted ground floor space with premium finishes and professional setup. This executive suite is move-in ready with all essential amenities and modern infrastructure in place."
  },
  "ctp-alpha-tower-1": {
    buildingId: "ctp-alpha-tower",
    floor: 1,
    totalArea: 1400,
    availableUnits: 1,
    totalUnits: 1,
    condition: "Warm Shell",
    features: [
      "Basic infrastructure installed",
      "HVAC system in place",
      "Electrical and data ready",
      "Flooring completed",
      "Ceiling and lighting installed",
      "Restroom facilities available"
    ],
    description: "Warm shell condition with basic infrastructure ready for tenant improvements. The space includes essential building systems and is prepared for your custom fit-out requirements."
  },
  "ctp-bf-building-1": {
    buildingId: "ctp-bf-building",
    floor: 1,
    totalArea: 1300,
    availableUnits: 1,
    totalUnits: 1,
    condition: "Bare",
    features: [
      "Raw concrete floors",
      "Exposed ceiling structure",
      "Basic electrical connections",
      "Plumbing rough-in complete",
      "Fire safety systems installed",
      "Structural elements finished"
    ],
    description: "Bare shell space offering maximum flexibility for tenant customization. This ground-level unit provides a blank canvas for businesses to create their ideal workspace according to specific requirements."
  }
};

// ===== FLOOR HELPER FUNCTIONS =====

// Get floor plans for a specific building
export const getBuildingFloorPlans = (buildingId: string): BuildingFloorPlan[] => {
  return buildingFloorPlans[buildingId] || [];
};

// Get floor details by building and floor number
export const getFloorDetails = (buildingId: string, floor: number): FloorInfo | null => {
  const key = `${buildingId}-${floor}`;
  return floorDetails[key] || null;
};

// Get all floors for a building
export const getBuildingFloors = (buildingId: string): number[] => {
  const floorPlans = getBuildingFloorPlans(buildingId);
  return floorPlans.map(plan => plan.floor);
};

// Get available floors (floors with available units)
export const getAvailableFloors = (buildingId: string): number[] => {
  const floorPlans = getBuildingFloorPlans(buildingId);
  return floorPlans
    .filter(plan => plan.available > 0)
    .map(plan => plan.floor);
};

// Get floor statistics
export const getFloorStats = (buildingId: string, floor: number) => {
  const floorPlan = buildingFloorPlans[buildingId]?.find(plan => plan.floor === floor);
  const floorInfo = getFloorDetails(buildingId, floor);
  
  if (!floorPlan || !floorInfo) return null;
  
  return {
    floor: floor,
    totalUnits: floorPlan.units,
    availableUnits: floorPlan.available,
    totalArea: floorPlan.totalSqft,
    condition: floorPlan.condition,
    occupancyRate: Math.round(((floorPlan.units - floorPlan.available) / floorPlan.units) * 100),
    features: floorInfo.features,
    description: floorInfo.description
  };
};

// Get total building area by summing all floors
export const getTotalBuildingArea = (buildingId: string): number => {
  const floorPlans = getBuildingFloorPlans(buildingId);
  return floorPlans.reduce((total, plan) => total + plan.totalSqft, 0);
};

// Get total available area in a building
export const getAvailableBuildingArea = (buildingId: string): number => {
  const floorPlans = getBuildingFloorPlans(buildingId);
  return floorPlans
    .filter(plan => plan.available > 0)
    .reduce((total, plan) => total + plan.totalSqft, 0);
};

// Check if a floor has available units
export const isFloorAvailable = (buildingId: string, floor: number): boolean => {
  const floorPlan = buildingFloorPlans[buildingId]?.find(plan => plan.floor === floor);
  return floorPlan ? floorPlan.available > 0 : false;
};

// Get floors by condition
export const getFloorsByCondition = (buildingId: string, condition: "Bare" | "Warm Shell" | "Fitted"): number[] => {
  const floorPlans = getBuildingFloorPlans(buildingId);
  return floorPlans
    .filter(plan => plan.condition === condition)
    .map(plan => plan.floor);
};

// Get all available floor conditions for a building
export const getAvailableConditions = (buildingId: string): ("Bare" | "Warm Shell" | "Fitted")[] => {
  const floorPlans = getBuildingFloorPlans(buildingId);
  const conditions = floorPlans
    .filter(plan => plan.available > 0)
    .map(plan => plan.condition);
  
  // Remove duplicates
  return [...new Set(conditions)];
};

// Validate floor data structure
export const validateFloorPlan = (floorPlan: any): floorPlan is BuildingFloorPlan => {
  return (
    typeof floorPlan.floor === 'number' &&
    typeof floorPlan.units === 'number' &&
    typeof floorPlan.totalSqft === 'number' &&
    typeof floorPlan.available === 'number' &&
    ['Bare', 'Warm Shell', 'Fitted'].includes(floorPlan.condition)
  );
};

// Validate floor info structure
export const validateFloorInfo = (floorInfo: any): floorInfo is FloorInfo => {
  return (
    typeof floorInfo.buildingId === 'string' &&
    typeof floorInfo.floor === 'number' &&
    typeof floorInfo.totalArea === 'number' &&
    typeof floorInfo.availableUnits === 'number' &&
    typeof floorInfo.totalUnits === 'number' &&
    ['Bare', 'Warm Shell', 'Fitted'].includes(floorInfo.condition) &&
    Array.isArray(floorInfo.features) &&
    typeof floorInfo.description === 'string'
  );
};