// ===== CTP ASEAN TOWER COMPLETE DATA =====
// All data related to CTP Asean Tower (building ID: ctp-red-corp)

// IMPORTS
import ImageUnavailable from "../assets/CTP_Red/CTP_ImageUnavailable.jpg";
import CTPAseanTowerImg from "../assets/CTP_Asean.PNG";

// For 1008
import Image1008_1 from "../assets/CTP_Red/CTP_ASEAN/1008/1008_1.jpg";
import Image1008_2 from "../assets/CTP_Red/CTP_ASEAN/1008/1008_2.jpg";
import Image1008_3 from "../assets/CTP_Red/CTP_ASEAN/1008/1008_3.jpg";
import Image1008_4 from "../assets/CTP_Red/CTP_ASEAN/1008/1008_4.jpg";
import Image1008_5 from "../assets/CTP_Red/CTP_ASEAN/1008/1008_5.jpg";

// For GF12
import ImageGF12_1 from "../assets/CTP_Red/CTP_ASEAN/GF12/GF12_1.jpg";
import ImageGF12_2 from "../assets/CTP_Red/CTP_ASEAN/GF12/GF12_2.jpg";


// For LP03 and LP04
import ImageLP03_1 from "../assets/CTP_Red/CTP_ASEAN/LP03_LP04/LP03_1.jpg";
import ImageLP03_2 from "../assets/CTP_Red/CTP_ASEAN/LP03_LP04/LP03_2.jpg";
import ImageLP03_3 from "../assets/CTP_Red/CTP_ASEAN/LP03_LP04/LP03_3.jpg";


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
  image: string | any;
  badge: string | any;
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
export const ctpAseanFloorPlans: BuildingFloorPlan[] = [
  { 
    floor: 0, // Ground Floor - 93.72% occupied
    units: 10, 
    totalSqm: 1741.98, 
    available: 1, // GF12 - 109.40m²
    condition: "Bare" 
  },
  { 
    floor: 4, // 100% occupied
    units: 1,
    totalSqm: 35.96, 
    available: 0, 
    condition: "Bare" 
  },
  { 
    floor: 5, // 100% occupied
    units: 6,
    totalSqm: 2573.52, 
    available: 0, 
    condition: "Bare" 
  },
  { 
    floor: 6, // 100% occupied
    units: 6,
    totalSqm: 2573.52, 
    available: 0, 
    condition: "Bare" 
  },
  { 
    floor: 7, // 100% occupied
    units: 6,
    totalSqm: 2573.52, 
    available: 0, 
    condition: "Bare" 
  },
  { 
    floor: 8, // 100% occupied
    units: 6,
    totalSqm: 2573.52, 
    available: 0, 
    condition: "Bare" 
  },
  { 
    floor: 9, // 100% occupied
    units: 6,
    totalSqm: 2573.52, 
    available: 0, 
    condition: "Bare" 
  },
  { 
    floor: 10, // 70% occupied - 2 vacant units (1001 - 372.63m², 1008 - 395.57m²)
    units: 6, 
    totalSqm: 2568.62,
    available: 2, 
    condition: "Warm Shell"
  },
  { 
    floor: 11, // 100% occupied
    units: 6,
    totalSqm: 2527.96, 
    available: 0, 
    condition: "Bare" 
  },
  { 
    floor: 12, // 100% occupied
    units: 6,
    totalSqm: 2573.52, 
    available: 0, 
    condition: "Bare" 
  },
  { 
    floor: 13, // Lower Penthouse - 55.96% occupied - 2 vacant units (LP03 - 461.20m², LP04 - 466.87m²)
    units: 4, 
    totalSqm: 2107.48,
    available: 2, 
    condition: "Bare" 
  },
  { 
    floor: 14, // Upper Penthouse - 68% occupied - 1 vacant unit (UP02 - 310.12m²)
    units: 3, 
    totalSqm: 960.27, 
    available: 1, 
    condition: "Bare" 
  }
];

// ===== FLOOR DETAILS DATA =====
export const ctpAseanFloorDetails: { [key: string]: FloorInfo } = {
  "ctp-red-corp-0": {
    buildingId: "ctp-red-corp",
    floor: 0,
    totalArea: 300,
    availableUnits: 1,
    totalUnits: 1,
    condition: "Bare",
    features: [
      "Ground floor accessibility",
      "Direct street access",
      "Basic building systems",
      "Security access ready",
      "HVAC infrastructure",
      "Electrical and data ready"
    ],
    description: ""
  },
  "ctp-red-corp-10": {
    buildingId: "ctp-red-corp",
    floor: 10,
    totalArea: 768.20,
    availableUnits: 2,
    totalUnits: 2,
    condition: "Warm Shell",
    features: [
      "High floor city views",
      "Basic infrastructure installed",
      "HVAC system in place",
      "Electrical and data ready",
      "Flooring completed",
      "Professional lighting installed"
    ],
    description: ""
  },
  "ctp-red-corp-13": {
    buildingId: "ctp-red-corp",
    floor: 13,
    totalArea: 928.07,
    availableUnits: 2,
    totalUnits: 2,
    condition: "Bare",
    features: [
      "Lower penthouse level",
      "Panoramic city views",
      "Basic building systems",
      "Security access ready",
      "HVAC infrastructure",
      "Electrical and data ready"
    ],
    description: ""
  },
  "ctp-red-corp-14": {
    buildingId: "ctp-red-corp",
    floor: 14,
    totalArea: 310.12,
    availableUnits: 1,
    totalUnits: 1,
    condition: "Bare",
    features: [
      "Upper penthouse level",
      "Exclusive top floor access",
      "Premium views",
      "Basic building systems",
      "Security access ready",
      "HVAC infrastructure"
    ],
    description: ""
  }
};

// ===== BUILDING INFORMATION =====
export const ctpAseanBuildingInfo: BuildingInfo = {
  id: "ctp-red-corp",
  name: "CTP Red Corp",
  displayName: "CTP Asean Tower",
  location: "Filinvest City, Alabang, Muntinlupa",
  shortLocation: "Downtown Business District",
  description: [
    "Situated on Asean Drive in Filinvest City, Alabang, Muntinlupa City, CTP Asean is positioned within a masterfully planned development that emphasizes sustainability and modern living.",
    "Filinvest City is a flagship project renowned for its strategic connectivity and accessibility, serving as a major gateway for commuters and a dynamic business district attracting multinational corporations and BPO companies.",
    "CTP Asean is a Grade A, 14-storey office building (Ground Floor, 2nd-12th Floor, plus Lower and Upper Penthouse) developed by CTP R.E.D. III Corp. It offers a substantial Net Leasable Area of 24,933 square meters, indicating a large-scale, modern facility designed to accommodate various business and organizations. The building's prime location within Filinvest City offers convenient access to a diverse range of dining, entertainment, and retail options, thereby enhancing the overall work experience for occupants."
  ],
  stats: {
    totalFloors: 12, // 12 floors in floor plans (0, 4-14)
    totalUnits: 62, // Total units across all floors (calculated from floor plans)
    occupancyRate: 90, // Will be dynamically calculated
    availableUnits: 6 // GF12, 1001, 1008, LP03, LP04, UP02
  },
  buildingHours: {
    weekdays: "6:00 AM - 10:00 PM",
    saturday: "8:00 AM - 8:00 PM",
    sunday: "10:00 AM - 6:00 PM",
    security: "24/7"
  },
  contact: {
    phone: "(555) 123-CORP",
    email: "aseantower@ctpcmc.com.ph",
    address: "Downtown Business District"
  },
  buildingFeatures: [
    { title: "High-Speed Internet", description: "Fiber optic connectivity up to 1Gbps" },
    { title: "24/7 Security", description: "Advanced security systems and on-site guards" },
    { title: "Parking", description: "Reserved and visitor parking available" },
    { title: "Café & Lounge", description: "On-site café and collaborative spaces" },
    { title: "Fitness Center", description: "Fully equipped gym for tenants" },
    { title: "Meeting Rooms", description: "State-of-the-art conference facilities" }
  ],
  floorPlans: ctpAseanFloorPlans,
  heroImage: CTPAseanTowerImg,
  image: CTPAseanTowerImg,
  badge: "Premium Location",
  ctaTitle: "Explore Premium Office Solutions",
  ctaDescription: "Discover the perfect workspace for your business in our modern facility with state-of-the-art amenities and prime location."
};

// ===== UNIT DATA =====
export const ctpAseanUnits: { [key: string]: Unit } = {
  "CRC-GF12": {
    id: "CRC-GF12",
    title: "Ground Floor (Unit GF12)",
    building: "CTP Asean Tower",
    location: "Filinvest City, Alabang, Muntinlupa",
    floor: 0,
    size: 109.40,
    capacity: 16,
    price: 32820,
    status: "Available",
    condition: "Bare",
    image: ImageGF12_1,
    images: [
      ImageGF12_1, 
      ImageGF12_2
    ],
    description: "Spacious ground floor commercial suite with direct street access and excellent visibility for businesses.",
    floorPlan: {
      totalArea: 109.40,
      privateOffices: 3,
      openWorkspace: 2,
      meetingRooms: 2,
      bathrooms: 2,
      kitchenette: true,
      storage: true
    },
    availability: {
      availableFrom: "Immediate",
      leaseTerms: ["6 months", "1 year", "2 years"],
      includedUtilities: ["Security", "Cleaning"],
      additionalCosts: ["HVAC: ₱100/month", "Parking: ₱150/month"]
    }
  },
  "CRC-1001": {
    id: "CRC-1001",
    title: "10th Floor (Unit 1001)",
    building: "CTP Asean Tower",
    location: "Filinvest City, Alabang, Muntinlupa",
    floor: 10,
    size: 372.63,
    capacity: 56,
    price: 111789,
    status: "Available",
    condition: "Warm Shell",
    image: ImageUnavailable,
    images: [
      ImageUnavailable
    ],
    description: "Large high floor executive office with city views and warm shell condition ready for tenant improvements.",
    floorPlan: {
      totalArea: 372.63,
      privateOffices: 8,
      openWorkspace: 4,
      meetingRooms: 3,
      bathrooms: 3,
      kitchenette: true,
      storage: true
    },
    availability: {
      availableFrom: "Immediate",
      leaseTerms: ["1 year", "2 years", "3 years"],
      includedUtilities: ["Internet", "Security", "Cleaning", "HVAC"],
      additionalCosts: ["Parking: ₱150/month"]
    }
  },
  "CRC-1008": {
    id: "CRC-1008",
    title: "10th Floor (UNIT 1008)",
    building: "CTP Asean Tower",
    location: "Filinvest City, Alabang, Muntinlupa",
    floor: 10,
    size: 395.57,
    capacity: 59,
    price: 118671,
    status: "Available",
    condition: "Fitted",
    image: Image1008_1,
    images: [
      Image1008_1,
      Image1008_2,
      Image1008_3,
      Image1008_4,
      Image1008_5
    ],
    description: "Large premium fitted office suite on the 10th floor with modern finishes and move-in ready amenities.",
    floorPlan: {
      totalArea: 395.57,
      privateOffices: 8,
      openWorkspace: 4,
      meetingRooms: 3,
      bathrooms: 3,
      kitchenette: true,
      storage: true
    },
    availability: {
      availableFrom: "Immediate",
      leaseTerms: ["1 year", "2 years", "3 years"],
      includedUtilities: ["Internet", "Security", "Cleaning", "HVAC"],
      additionalCosts: ["Parking: ₱150/month"]
    }
  },
  "CRC-LP03": {
    id: "CRC-LP03",
    title: "Lower Penthouse (Unit LP03)",
    building: "CTP Asean Tower",
    location: "Filinvest City, Alabang, Muntinlupa",
    floor: 13,
    size: 461.20,
    capacity: 69,
    price: 138360,
    status: "Available",
    condition: "Bare",
    image: ImageLP03_1,
    images: [
      ImageLP03_1, 
      ImageLP03_2,
      ImageLP03_3
    ],
    description: "Expansive lower penthouse suite with panoramic city views and customizable bare shell condition.",
    floorPlan: {
      totalArea: 461.20,
      privateOffices: 10,
      openWorkspace: 5,
      meetingRooms: 4,
      bathrooms: 4,
      kitchenette: true,
      storage: true
    },
    availability: {
      availableFrom: "Immediate",
      leaseTerms: ["2 years", "3 years", "5 years"],
      includedUtilities: ["Security", "Cleaning"],
      additionalCosts: ["HVAC: ₱200/month", "Parking: ₱200/month"]
    }
  },
  "CRC-LP04": {
    id: "CRC-LP04",
    title: "Lower Penthouse (Unit LP04)",
    building: "CTP Asean Tower",
    location: "Filinvest City, Alabang, Muntinlupa",
    floor: 13,
    size: 466.87,
    capacity: 70,
    price: 140061,
    status: "Available",
    condition: "Bare",
    image: ImageLP03_1,
    images: [
      ImageLP03_1, 
      ImageLP03_2,
      ImageLP03_3
    ],
    description: "Premium expansive lower penthouse office with excellent customization potential.",
    floorPlan: {
      totalArea: 466.87,
      privateOffices: 10,
      openWorkspace: 5,
      meetingRooms: 4,
      bathrooms: 4,
      kitchenette: true,
      storage: true
    },
    availability: {
      availableFrom: "Immediate",
      leaseTerms: ["2 years", "3 years", "5 years"],
      includedUtilities: ["Security", "Cleaning"],
      additionalCosts: ["HVAC: ₱200/month", "Parking: ₱200/month"]
    }
  },
  "CRC-UP02": {
    id: "CRC-UP02",
    title: "Upper Penthouse Exclusive Suite",
    building: "CTP Asean Tower",
    location: "Filinvest City, Alabang, Muntinlupa",
    floor: 14,
    size: 310.12,
    capacity: 47,
    price: 93036,
    status: "Available",
    condition: "Bare",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549037328-5d1b75eaa704?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    description: "Exclusive expansive upper penthouse with top floor privacy and 360-degree city views.",
    floorPlan: {
      totalArea: 310.12,
      privateOffices: 6,
      openWorkspace: 3,
      meetingRooms: 3,
      bathrooms: 3,
      kitchenette: true,
      storage: true
    },
    availability: {
      availableFrom: "Immediate",
      leaseTerms: ["3 years", "5 years"],
      includedUtilities: ["Security", "Cleaning"],
      additionalCosts: ["HVAC: ₱250/month", "Parking: ₱300/month"]
    }
  }
};

// ===== HELPER FUNCTIONS =====

// Get floor plans for CTP Asean Tower
export const getCtpAseanFloorPlans = (): BuildingFloorPlan[] => {
  return ctpAseanFloorPlans;
};

// Get floor details for CTP Asean Tower
export const getCtpAseanFloorDetails = (): { [key: string]: FloorInfo } => {
  return ctpAseanFloorDetails;
};

// Get specific floor detail by floor number
export const getCtpAseanFloorDetail = (floor: number): FloorInfo | null => {
  const key = `ctp-red-corp-${floor}`;
  return ctpAseanFloorDetails[key] || null;
};

// Get total area for CTP Asean Tower
export const getCtpAseanTotalArea = (): number => {
  return ctpAseanFloorPlans.reduce((total, plan) => total + plan.totalSqm, 0);
};

// Get available floors for CTP Asean Tower
export const getCtpAseanAvailableFloors = (): number[] => {
  return ctpAseanFloorPlans
    .filter(plan => plan.available > 0)
    .map(plan => plan.floor);
};