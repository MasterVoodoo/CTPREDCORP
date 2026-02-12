// ===== CENTRALIZED CTP DATA INDEX FILE =====
// This file serves as the main entry point and imports data from individual building files

// ===== IMPORT BUILDING-SPECIFIC DATA =====
import CTPAlphaTowerImg from "../assets/CTP_Alpha_Tower.jpg";
import CTPAseanTowerImg from "../assets/CTP_Asean.PNG";
import CTPBFImg from "../assets/CTP_BF.jpg";
import {
  ctpAseanBuildingInfo,
  ctpAseanUnits,
  ctpAseanFloorPlans,
  ctpAseanFloorDetails,
  getCtpAseanFloorPlans,
  getCtpAseanFloorDetails,
  getCtpAseanFloorDetail,
  getCtpAseanTotalArea,
  getCtpAseanAvailableFloors,
  // Import types
  type FloorPlan,
  type Availability,
  type Unit,
  type BuildingFeature,
  type BuildingStats,
  type BuildingHours,
  type BuildingContact,
  type BuildingFloorPlan,
  type BuildingInfo,
  type FloorInfo
} from "./ctpAsean";

import {
  ctpAlphaBuildingInfo,
  ctpAlphaUnits,
  ctpAlphaFloorPlans,
  ctpAlphaFloorDetails,
  getCtpAlphaFloorPlans,
  getCtpAlphaFloorDetails,
  getCtpAlphaFloorDetail,
  getCtpAlphaTotalArea,
  getCtpAlphaAvailableFloors
} from "./ctpAlpha";

import {
  ctpBFBuildingInfo,
  ctpBFUnits,
  ctpBFFloorPlans,
  ctpBFFloorDetails,
  getCtpBFFloorPlans,
  getCtpBFFloorDetails,
  getCtpBFFloorDetail,
  getCtpBFTotalArea,
  getCtpBFAvailableFloors
} from "./ctpBF";

// ===== RE-EXPORT TYPES =====
export type {
  FloorPlan,
  Availability,
  Unit,
  BuildingFeature,
  BuildingStats,
  BuildingHours,
  BuildingContact,
  BuildingFloorPlan,
  BuildingInfo,
  FloorInfo
};

// ===== ADDITIONAL TYPES =====
export interface FeaturedListing {
  id: number;
  unitId: string;
  title: string;
  building: string;
  location: string;
  size: string;
  capacity: string;
  price: string;
  image: string | any;      // fallback or external image
  heroImage?: string | any; // optional local asset override
  status: string;
}

export interface CompanyStats {
  icon: any;
  number: string;
  label: string;
  description: string;
}

export interface SimpleBuildingStats {
  building: string;
  totalFloors: number;
  totalUnits: number;
  availableUnits: number;
  area: string;
}

// ===== COMPANY OVERVIEW DATA =====
export const companyOverview = {
  totalBuildings: 3,
  totalCapacity: 27,
  experienceYears: "15+",
  availabilityPercentage: "100%",
  name: "CTP RED CORP",
  tagline: "Home for Every Vision",
  mission: "Creating Space. Building Progress.",
  yearsInBusiness: 15
};

// ===== CONSOLIDATED BUILDING DATA =====
export const buildings: { [key: string]: BuildingInfo } = {
  "ctp-red-corp": ctpAseanBuildingInfo,
  "ctp-alpha-tower": ctpAlphaBuildingInfo,
  "ctp-bf-building": ctpBFBuildingInfo
};

// ===== CONSOLIDATED UNIT DATA =====
export const units: { [key: string]: Unit } = {
  ...ctpAseanUnits,
  ...ctpAlphaUnits,
  ...ctpBFUnits
};

// ===== FEATURED LISTINGS =====
export const featuredListings: FeaturedListing[] = [
  {
    id: 1,
    unitId: "ctp-alpha-tower",
    title: "CTP Alpha Tower",
    building: "1709 Investment Dr, Muntinlupa",
    location: "Ground Floor, 2-11, Penthouse",
    size: "5,537.25 sq m", // Total leasable area
    capacity: "21 units",
    price: "₱28,502/month", // Average price per unit
    image: "fallback-image.jpg", // could still exist as fallback
    heroImage: CTPAlphaTowerImg, // ✅ local asset
    status: "2 Available"
  },
  {
    id: 2,
    unitId: "ctp-red-corp",
    title: "CTP Asean Tower",
    building: "Asean Drive, Alabang, Muntinlupa",
    location: "Ground Floor, 4-12, Lower & Upper Penthouse",
    size: "25,383.39 sq m", // Total leasable area
    capacity: "62 units",
    price: "₱105,706/month", // Average price per unit
    image: CTPAseanTowerImg,
    status: "6 Available"
  },
  {
    id: 3,
    unitId: "ctp-bf-building",
    title: "CTP BF Building",
    building: "11 President's Ave, Parañaque, Metro Manila",
    location: "Multiple floors available",
    size: "120.80 sq m",
    capacity: "9 Units",
    price: "₱3,600/month",
    image: CTPBFImg,
    heroImage: CTPBFImg,
    status: "Available"
  }
];

// ===== RE-EXPORT INDIVIDUAL BUILDING FLOOR DATA =====
// Re-export for components that need access to specific building floor data
export { 
  // CTP Asean Tower
  ctpAseanFloorPlans, 
  ctpAseanFloorDetails,
  getCtpAseanFloorPlans,
  getCtpAseanFloorDetails,
  getCtpAseanFloorDetail,
  getCtpAseanTotalArea,
  getCtpAseanAvailableFloors,
  
  // CTP Alpha Tower
  ctpAlphaFloorPlans, 
  ctpAlphaFloorDetails,
  getCtpAlphaFloorPlans,
  getCtpAlphaFloorDetails,
  getCtpAlphaFloorDetail,
  getCtpAlphaTotalArea,
  getCtpAlphaAvailableFloors,
  
  // CTP BF Building
  ctpBFFloorPlans, 
  ctpBFFloorDetails,
  getCtpBFFloorPlans,
  getCtpBFFloorDetails,
  getCtpBFFloorDetail,
  getCtpBFTotalArea,
  getCtpBFAvailableFloors
};

// ===== FLOOR PLANS DATA =====
// Re-export consolidated floor data for backward compatibility
export const buildingFloorPlans: { [buildingId: string]: BuildingFloorPlan[] } = {
  "ctp-red-corp": ctpAseanFloorPlans,
  "ctp-alpha-tower": ctpAlphaFloorPlans,
  "ctp-bf-building": ctpBFFloorPlans
};

// ===== FLOOR DETAILS DATA =====
// Consolidate floor details from all buildings
export const floorDetails: { [key: string]: FloorInfo } = {
  ...ctpAseanFloorDetails,
  ...ctpAlphaFloorDetails,
  ...ctpBFFloorDetails
};

// ===== STATISTICS DATA =====
export const companyStatistics: CompanyStats[] = [
  {
    icon: null, // Icons will be passed from components
    number: companyOverview.totalBuildings.toString(),
    label: "Premium Buildings",
    description: "Strategically located across the city",
  },
  {
    icon: null,
    number: companyOverview.totalCapacity.toString(),
    label: "Total Capacity",
    description: "People across all floors",
  },
  {
    icon: null,
    number: companyOverview.availabilityPercentage,
    label: "Available Space",
    description: "All floors ready for occupancy",
  },
  {
    icon: null,
    number: companyOverview.experienceYears,
    label: "Years Experience",
    description: "In commercial real estate",
  },
];

export const simpleBuildingStatistics: SimpleBuildingStats[] = [
  {
    building: buildings["ctp-red-corp"].displayName,
    totalFloors: buildings["ctp-red-corp"].stats.totalFloors,
    totalUnits: buildings["ctp-red-corp"].stats.totalUnits,
    availableUnits: buildings["ctp-red-corp"].stats.availableUnits,
    area: `${buildings["ctp-red-corp"].floorPlans[0].totalSqm.toLocaleString()} sq m`,
  },
  {
    building: buildings["ctp-alpha-tower"].displayName,
    totalFloors: buildings["ctp-alpha-tower"].stats.totalFloors,
    totalUnits: buildings["ctp-alpha-tower"].stats.totalUnits,
    availableUnits: buildings["ctp-alpha-tower"].stats.availableUnits,
    area: `${buildings["ctp-alpha-tower"].floorPlans[0].totalSqm.toLocaleString()} sq m`,
  },
  {
    building: buildings["ctp-bf-building"].displayName,
    totalFloors: buildings["ctp-bf-building"].stats.totalFloors,
    totalUnits: buildings["ctp-bf-building"].stats.totalUnits,
    availableUnits: buildings["ctp-bf-building"].stats.availableUnits,
    area: `${buildings["ctp-bf-building"].floorPlans[0].totalSqm.toLocaleString()} sq m`,
  },
];

// ===== HELPER FUNCTIONS =====

// Get all buildings as an array
export const getBuildingsList = (): BuildingInfo[] => {
  return Object.values(buildings);
};

// Get building by ID
export const getBuildingById = (buildingId: string): BuildingInfo | null => {
  return buildings[buildingId] || null;
};

// Get all building IDs
export const getAllBuildingIds = (): string[] => {
  return Object.keys(buildings);
};

// Get unit by ID
export const getUnitById = (unitId: string): Unit | null => {
  return units[unitId] || null;
};

// Get all units as an array (includes Unavailable units for admin)
export const getAllUnits = (): Unit[] => {
  return Object.values(units);
};

// Get all publicly visible units (excludes Unavailable)
export const getPublicUnits = (): Unit[] => {
  return Object.values(units).filter(unit => unit.status !== "Unavailable");
};

// Get units by building ID (excludes Unavailable for public display)
export const getUnitsByBuilding = (buildingId: string): Unit[] => {
  const allUnits = getPublicUnits();
  const building = getBuildingById(buildingId);
  
  if (!building) return [];
  
  return allUnits.filter(unit => {
    switch (buildingId) {
      case 'ctp-red-corp':
        return unit.id.startsWith('CRC-');
      case 'ctp-alpha-tower':
        return unit.id.startsWith('CAT-');
      case 'ctp-bf-building':
        return unit.id.startsWith('CBF-');
      default:
        return false;
    }
  });
};

// Get ALL units by building ID (includes Unavailable for admin use)
export const getAllUnitsByBuilding = (buildingId: string): Unit[] => {
  const allUnits = getAllUnits();
  const building = getBuildingById(buildingId);
  
  if (!building) return [];
  
  return allUnits.filter(unit => {
    switch (buildingId) {
      case 'ctp-red-corp':
        return unit.id.startsWith('CRC-');
      case 'ctp-alpha-tower':
        return unit.id.startsWith('CAT-');
      case 'ctp-bf-building':
        return unit.id.startsWith('CBF-');
      default:
        return false;
    }
  });
};

// Get floor plans for a specific building
export const getBuildingFloorPlans = (buildingId: string): BuildingFloorPlan[] => {
  return buildingFloorPlans[buildingId] || [];
};

// Get floor details by building and floor number
export const getFloorDetails = (buildingId: string, floor: number): FloorInfo | null => {
  const key = `${buildingId}-${floor}`;
  return floorDetails[key] || null;
};

// Get units by building and floor (excludes Unavailable)
export const getUnitsByBuildingAndFloor = (buildingId: string, floor: number): Unit[] => {
  const buildingUnits = getUnitsByBuilding(buildingId);
  return buildingUnits.filter(unit => unit.floor === floor);
};

// Get available units count by building
export const getAvailableUnitsCount = (buildingId: string): number => {
  const buildingUnits = getUnitsByBuilding(buildingId);
  return buildingUnits.filter(unit => unit.status === 'Available').length;
};

// Get available units by building
export const getAvailableUnitsByBuilding = (buildingId: string): Unit[] => {
  const buildingUnits = getUnitsByBuilding(buildingId);
  return buildingUnits.filter(unit => unit.status === 'Available');
};

// Get units by status (excludes Unavailable from public searches)
export const getUnitsByStatus = (status: "Available" | "Coming Soon" | "Taken"): Unit[] => {
  const publicUnits = getPublicUnits();
  return publicUnits.filter(unit => unit.status === status);
};

// Get building statistics
export const getBuildingStats = (buildingId: string) => {
  const building = getBuildingById(buildingId);
  if (!building) return null;
  
  const buildingUnits = getUnitsByBuilding(buildingId);
  const availableUnits = buildingUnits.filter(unit => unit.status === 'Available').length;
  const totalUnits = buildingUnits.length;
  
  return {
    ...building.stats,
    actualTotalUnits: totalUnits,
    actualAvailableUnits: availableUnits,
    actualOccupancyRate: Math.round(((totalUnits - availableUnits) / totalUnits) * 100)
  };
};

// Search units by criteria (excludes Unavailable)
export const searchUnits = (criteria: {
  buildingId?: string;
  floor?: number;
  minSize?: number;
  maxSize?: number;
  maxPrice?: number;
  status?: "Available" | "Coming Soon" | "Taken";
}): Unit[] => {
  let filteredUnits = getPublicUnits();
  
  if (criteria.buildingId) {
    filteredUnits = getUnitsByBuilding(criteria.buildingId);
  }
  
  if (criteria.floor !== undefined) {
    filteredUnits = filteredUnits.filter(unit => unit.floor === criteria.floor);
  }
  
  if (criteria.minSize !== undefined) {
    filteredUnits = filteredUnits.filter(unit => unit.size >= criteria.minSize!);
  }
  
  if (criteria.maxSize !== undefined) {
    filteredUnits = filteredUnits.filter(unit => unit.size <= criteria.maxSize!);
  }
  
  if (criteria.maxPrice !== undefined) {
    filteredUnits = filteredUnits.filter(unit => unit.price <= criteria.maxPrice!);
  }
  
  if (criteria.status) {
    filteredUnits = filteredUnits.filter(unit => unit.status === criteria.status);
  }
  
  return filteredUnits;
};

// Get units summary for admin/editing purposes (includes Unavailable)
export const getUnitsForAdmin = () => {
  const adminData: { [buildingId: string]: Unit[] } = {};
  
  getAllBuildingIds().forEach(buildingId => {
    adminData[buildingId] = getAllUnitsByBuilding(buildingId);
  });
  
  return adminData;
};

// Calculate total capacity across all buildings
export const getTotalCapacity = (): number => {
  const allUnits = getPublicUnits();
  return allUnits.reduce((total, unit) => total + unit.capacity, 0);
};

// Calculate total area across all buildings
export const getTotalArea = (): number => {
  const allUnits = getPublicUnits();
  return allUnits.reduce((total, unit) => total + unit.size, 0);
};

// Get occupancy rate across all buildings
export const getOverallOccupancyRate = (): number => {
  const allUnits = getPublicUnits();
  const occupiedUnits = allUnits.filter(unit => unit.status === 'Taken').length;
  return allUnits.length > 0 ? Math.round((occupiedUnits / allUnits.length) * 100) : 0;
};

// ===== ENHANCED FLOOR DATA HELPER FUNCTIONS =====

// Get all floors for a building (unified access)
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
    totalArea: floorPlan.totalSqm,
    condition: floorPlan.condition,
    occupancyRate: Math.round(((floorPlan.units - floorPlan.available) / floorPlan.units) * 100),
    features: floorInfo.features,
    description: floorInfo.description
  };
};

// Get total building area by summing all floors
export const getTotalBuildingArea = (buildingId: string): number => {
  const floorPlans = getBuildingFloorPlans(buildingId);
  return floorPlans.reduce((total, plan) => total + plan.totalSqm, 0);
};

// Get total available area in a building
export const getAvailableBuildingArea = (buildingId: string): number => {
  const floorPlans = getBuildingFloorPlans(buildingId);
  return floorPlans
    .filter(plan => plan.available > 0)
    .reduce((total, plan) => total + plan.totalSqm, 0);
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

// Validation functions
export const validateUnit = (unit: any): unit is Unit => {
  return (
    typeof unit.id === 'string' &&
    typeof unit.title === 'string' &&
    typeof unit.building === 'string' &&
    typeof unit.location === 'string' &&
    typeof unit.floor === 'number' &&
    typeof unit.size === 'number' &&
    typeof unit.capacity === 'number' &&
    typeof unit.price === 'number' &&
    ['Available', 'Coming Soon', 'Taken', 'Unavailable'].includes(unit.status) &&
    ['Bare', 'Warm Shell', 'Fitted'].includes(unit.condition) &&
    typeof unit.image === 'string'
  );
};

export const validateBuilding = (building: any): building is BuildingInfo => {
  return (
    typeof building.id === 'string' &&
    typeof building.name === 'string' &&
    typeof building.displayName === 'string' &&
    typeof building.location === 'string' &&
    Array.isArray(building.description) &&
    typeof building.stats === 'object' &&
    Array.isArray(building.buildingFeatures)
  );
};