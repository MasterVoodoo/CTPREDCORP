// ===== CTP ASEAN TOWER COMPLETE DATA =====
// All data related to CTP Asean Tower (building ID: ctp-red-corp)

// IMPORTS
import ImageUnavailable from "../assets/CTP_Red/CTP_ImageUnavailable.jpg";

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
  totalSqft: number;
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
export const ctpAseanFloorPlans: BuildingFloorPlan[] = [
  { 
    floor: 0, // Ground floor for GF12
    units: 1, 
    totalSqft: 300, 
    available: 1, 
    condition: "Bare" 
  },
  { 
    floor: 10, // Floor 10 for units 1001 and 1008
    units: 2, 
    totalSqft: 768.20, // 372.63 + 395.57
    available: 2, 
    condition: "Warm Shell" // Using the first unit's condition as representative
  },
  { 
    floor: 11, // Lower Penthouse for LP03 and LP04
    units: 2, 
    totalSqft: 928.07, // 461.2 + 466.87
    available: 2, 
    condition: "Bare" 
  },
  { 
    floor: 12, // Upper Penthouse for UP02
    units: 1, 
    totalSqft: 310.12, 
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
  "ctp-red-corp-11": {
    buildingId: "ctp-red-corp",
    floor: 11,
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
  "ctp-red-corp-12": {
    buildingId: "ctp-red-corp",
    floor: 12,
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
    "CTP Asean is a Grade A, 13-storey office building developed by CTP R.E.D. III Corp. It offers a substantial Net Leasable Area of 24,933 square meters, indicating a large-scale, modern facility designed to accommodate various business and organizations. The building's prime location within Filinvest City offers convenient access to a diverse range of dining, entertainment, and retail options, thereby enhancing the overall work experience for occupants."
  ],
  stats: {
    totalFloors: 4, // Ground, 10th, Lower Pent, Upper Pent
    totalUnits: 6, // GF12, 1001, 1008, LP03, LP04, UP02
    occupancyRate: 0,
    availableUnits: 6
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
  heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  image: "https://images.unsplash.com/photo-1595197658178-79247d3a7941?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZyUyMGV4dGVyaW9yJTIwZ2xhc3N8ZW58MXx8fHwxNzU5Mjk4NjQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
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
    size: 300,
    capacity: 4,
    price: 2506,
    status: "Available",
    condition: "Bare",
    image: ImageGF12_1,
    images: [
      ImageGF12_1, 
      ImageGF12_2
    ],
    description: "Ground floor commercial suite with direct street access and excellent visibility for businesses.",
    floorPlan: {
      totalArea: 300,
      privateOffices: 1,
      openWorkspace: 1,
      meetingRooms: 1,
      bathrooms: 1,
      kitchenette: false,
      storage: true
    },
    availability: {
      availableFrom: "Immediate",
      leaseTerms: ["6 months", "1 year", "2 years"],
      includedUtilities: ["Security", "Cleaning"],
      additionalCosts: ["HVAC: $100/month", "Parking: $150/month"]
    }
  },
  "CRC-1001": {
    id: "CRC-1001",
    title: "10th Floor (Unit 1001)",
    building: "CTP Asean Tower",
    location: "Filinvest City, Alabang, Muntinlupa",
    floor: 10,
    size: 372.63,
    capacity: 6,
    price: 2504,
    status: "Available",
    condition: "Warm Shell",
    image: ImageUnavailable,
    images: [
      ImageUnavailable
    ],
    description: "High floor executive office with city views and warm shell condition ready for tenant improvements.",
    floorPlan: {
      totalArea: 372.63,
      privateOffices: 2,
      openWorkspace: 1,
      meetingRooms: 1,
      bathrooms: 1,
      kitchenette: true,
      storage: true
    },
    availability: {
      availableFrom: "Immediate",
      leaseTerms: ["1 year", "2 years", "3 years"],
      includedUtilities: ["Internet", "Security", "Cleaning", "HVAC"],
      additionalCosts: ["Parking: $150/month"]
    }
  },
  "CRC-1008": {
    id: "CRC-1008",
    title: "10th Floor (UNIT 1008)",
    building: "CTP Asean Tower",
    location: "Filinvest City, Alabang, Muntinlupa",
    floor: 10,
    size: 395.57,
    capacity: 7,
    price: 2505,
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
    description: "Premium fitted office suite on the 10th floor with modern finishes and move-in ready amenities.",
    floorPlan: {
      totalArea: 395.57,
      privateOffices: 3,
      openWorkspace: 1,
      meetingRooms: 1,
      bathrooms: 2,
      kitchenette: true,
      storage: true
    },
    availability: {
      availableFrom: "Immediate",
      leaseTerms: ["1 year", "2 years", "3 years"],
      includedUtilities: ["Internet", "Security", "Cleaning", "HVAC"],
      additionalCosts: ["Parking: $150/month"]
    }
  },
  "CRC-LP03": {
    id: "CRC-LP03",
    title: "Lower Penthouse (Unit LP03)",
    building: "CTP Asean Tower",
    location: "Filinvest City, Alabang, Muntinlupa",
    floor: 11,
    size: 461.2,
    capacity: 8,
    price: 2502,
    status: "Available",
    condition: "Bare",
    image: ImageLP03_1,
    images: [
      ImageLP03_1, 
      ImageLP03_2,
      ImageLP03_3
    ],
    description: "Spacious lower penthouse suite with panoramic city views and customizable bare shell condition.",
    floorPlan: {
      totalArea: 461.2,
      privateOffices: 3,
      openWorkspace: 2,
      meetingRooms: 2,
      bathrooms: 2,
      kitchenette: true,
      storage: true
    },
    availability: {
      availableFrom: "Immediate",
      leaseTerms: ["2 years", "3 years", "5 years"],
      includedUtilities: ["Security", "Cleaning"],
      additionalCosts: ["HVAC: $200/month", "Parking: $200/month"]
    }
  },
  "CRC-LP04": {
    id: "CRC-LP04",
    title: "Lower Penthouse (Unit LP04)",
    building: "CTP Asean Tower",
    location: "Filinvest City, Alabang, Muntinlupa",
    floor: 11,
    size: 466.87,
    capacity: 8,
    price: 2503,
    status: "Available",
    condition: "Bare",
    image: ImageLP03_1,
    images: [
      ImageLP03_1, 
      ImageLP03_2,
      ImageLP03_3
    ],
    description: "Premium lower penthouse office with expansive space and excellent customization potential.",
    floorPlan: {
      totalArea: 466.87,
      privateOffices: 3,
      openWorkspace: 2,
      meetingRooms: 2,
      bathrooms: 2,
      kitchenette: true,
      storage: true
    },
    availability: {
      availableFrom: "Immediate",
      leaseTerms: ["2 years", "3 years", "5 years"],
      includedUtilities: ["Security", "Cleaning"],
      additionalCosts: ["HVAC: $200/month", "Parking: $200/month"]
    }
  },
  "CRC-UP02": {
    id: "CRC-UP02",
    title: "Upper Penthouse Exclusive Suite",
    building: "CTP Asean Tower",
    location: "Filinvest City, Alabang, Muntinlupa",
    floor: 12,
    size: 310.12,
    capacity: 5,
    price: 2501,
    status: "Available",
    condition: "Bare",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549037328-5d1b75eaa704?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    description: "Exclusive upper penthouse with top floor privacy and 360-degree city views.",
    floorPlan: {
      totalArea: 310.12,
      privateOffices: 2,
      openWorkspace: 1,
      meetingRooms: 1,
      bathrooms: 2,
      kitchenette: true,
      storage: true
    },
    availability: {
      availableFrom: "Immediate",
      leaseTerms: ["3 years", "5 years"],
      includedUtilities: ["Security", "Cleaning"],
      additionalCosts: ["HVAC: $250/month", "Parking: $300/month"]
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
  return ctpAseanFloorPlans.reduce((total, plan) => total + plan.totalSqft, 0);
};

// Get available floors for CTP Asean Tower
export const getCtpAseanAvailableFloors = (): number[] => {
  return ctpAseanFloorPlans
    .filter(plan => plan.available > 0)
    .map(plan => plan.floor);
};