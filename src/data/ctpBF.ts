// ===== CTP BF BUILDING COMPLETE DATA =====
// All data related to CTP BF Building (building ID: ctp-bf-building)

// IMPORTS
import ImageUnavailable from "../assets/CTP_Red/CTP_ImageUnavailable.jpg";
import CTPBFImg from "../assets/CTP_BF.jpg";

// ===== TYPES =====
export interface FloorPlan {
  totalArea: number;
  privateOffices: number;
  openWorkspace: number;
  meetingRooms: number;
  bathrooms: number;
  kitchenette: boolean;
  storage: boolean;
}

export interface Availability {
  availableFrom: string;
  leaseTerms: string[];
  includedUtilities: string[];
  additionalCosts: string[];
}

export interface Unit {
  id: string;
  title: string;
  building: string;
  location: string;
  floor: number;
  size: number;
  capacity: number;
  price: number;
  status: "Available" | "Coming Soon" | "Taken" | "Unavailable";
  condition: "Bare" | "Warm Shell" | "Fitted";
  image: string;
  images?: string[];
  description?: string;
  floorPlan?: FloorPlan;
  availability?: Availability;
}

export interface BuildingFeature {
  title: string;
  description: string;
}

export interface BuildingStats {
  totalFloors: number;
  totalUnits: number;
  occupancyRate: number;
  availableUnits: number;
}

export interface BuildingHours {
  weekdays: string;
  saturday: string;
  sunday: string;
  security: string;
}

export interface BuildingContact {
  phone: string;
  email: string;
  address: string;
}

export interface BuildingFloorPlan {
  floor: number;
  units: number;
  totalSqm: number;
  available: number;
  condition: "Bare" | "Warm Shell" | "Fitted";
}

export interface BuildingInfo {
  id: string;
  name: string;
  displayName: string;
  location: string;
  shortLocation: string;
  description: string[];
  stats: BuildingStats;
  buildingHours: BuildingHours;
  contact: BuildingContact;
  buildingFeatures: BuildingFeature[];
  floorPlans: BuildingFloorPlan[];
  heroImage: string;
  image: string;
  badge: string;
  ctaTitle: string;
  ctaDescription: string;
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

// ===== FLOOR PLANS DATA =====
export const ctpBFFloorPlans: BuildingFloorPlan[] = [
  { 
    floor: 1, 
    units: 1, 
    totalSqm: 120.80, 
    available: 1, 
    condition: "Bare" 
  }
];

// ===== FLOOR DETAILS DATA =====
export const ctpBFFloorDetails: { [key: string]: FloorInfo } = {
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

// ===== BUILDING INFORMATION =====
export const ctpBFBuildingInfo: BuildingInfo = {
  id: "ctp-bf-building",
  name: "CTP BF Building",
  displayName: "CTP BF Building",
  location: "11 President's Ave, Parañaque, Metro Manila",
  shortLocation: "11 President's Ave, Parañaque, Metro Manila",
  description: [
    "CTP BF Building offers modern office solutions in the heart of Bonifacio Global City, one of Metro Manila's most dynamic business districts. This contemporary building provides flexible workspace options for businesses of all sizes.",
    "Located within walking distance of major shopping centers, restaurants, and transportation hubs, the building offers unparalleled convenience and connectivity for your business operations and employee satisfaction.",
    "With its sustainable design features and modern amenities, CTP BF Building represents an ideal choice for companies seeking quality office space in BGC's vibrant business ecosystem."
  ],
  stats: {
    totalFloors: 1,
    totalUnits: 1,
    occupancyRate: 0,
    availableUnits: 1
  },
  buildingHours: {
    weekdays: "6:00 AM - 10:00 PM",
    saturday: "8:00 AM - 8:00 PM",
    sunday: "10:00 AM - 6:00 PM",
    security: "24/7"
  },
  contact: {
    phone: "(555) 345-BUILDING",
    email: "bgc@ctpredcorp.com",
    address: "11 President's Ave, Parañaque, Metro Manila"
  },
  buildingFeatures: [
    { title: "Reliable Internet", description: "High-speed fiber connectivity" },
    { title: "Complete Security", description: "Round-the-clock security services" },
    { title: "Parking Available", description: "Ample parking spaces for tenants" },
    { title: "Business Lounge", description: "Comfortable common areas and café" },
    { title: "Fitness Facilities", description: "On-site gym and wellness center" },
    { title: "Meeting Spaces", description: "Shared conference and meeting rooms" }
  ],
  floorPlans: ctpBFFloorPlans,
  heroImage: CTPBFImg,
  image: CTPBFImg,
  badge: "BGC Prime Location",
  ctaTitle: "Ready to Join BGC's Business Community?",
  ctaDescription: "Experience the convenience and connectivity of working in Bonifacio Global City. Contact us today to schedule a tour of CTP BF Building and explore your options."
};

// ===== UNIT DATA =====
export const ctpBFUnits: { [key: string]: Unit } = {
  "CBF-001": {
    id: "CBF-001",
    title: "1st Floor (Unit 001)",
    building: "CTP BF Building",
    location: "11 President's Ave, Parañaque, Metro Manila",
    floor: 1,
    size: 120.80,
    capacity: 9,
    price: 108720,
    status: "Available",
    condition: "Bare",
    image: ImageUnavailable,
    images: [
      ImageUnavailable
    ],
    description: "Spacious bare shell office space in BGC offering complete customization flexibility for your business needs.",
    floorPlan: {
      totalArea: 120.80,
      privateOffices: 0,
      openWorkspace: 1,
      meetingRooms: 0,
      bathrooms: 2,
      kitchenette: false,
      storage: true
    },
    availability: {
      availableFrom: "Available Now",
      leaseTerms: ["1 year", "2 years", "3 years"],
      includedUtilities: ["Security", "Cleaning"],
      additionalCosts: ["HVAC: ₱200/month", "Parking: ₱200/month"]
    }
  }
};

// ===== HELPER FUNCTIONS =====

// Get floor plans for CTP BF Building
export const getCtpBFFloorPlans = (): BuildingFloorPlan[] => {
  return ctpBFFloorPlans;
};

// Get floor details for CTP BF Building
export const getCtpBFFloorDetails = (): { [key: string]: FloorInfo } => {
  return ctpBFFloorDetails;
};

// Get specific floor detail by floor number
export const getCtpBFFloorDetail = (floor: number): FloorInfo | null => {
  const key = `ctp-bf-building-${floor}`;
  return ctpBFFloorDetails[key] || null;
};

// Get total area for CTP BF Building
export const getCtpBFTotalArea = (): number => {
  return ctpBFFloorPlans.reduce((total, plan) => total + plan.totalSqm, 0);
};

// Get available floors for CTP BF Building
export const getCtpBFAvailableFloors = (): number[] => {
  return ctpBFFloorPlans
    .filter(plan => plan.available > 0)
    .map(plan => plan.floor);
};