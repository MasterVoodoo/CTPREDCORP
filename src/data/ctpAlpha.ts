// ===== CTP ALPHA TOWER COMPLETE DATA =====
// All data related to CTP Alpha Tower (building ID: ctp-alpha-tower)

// IMPORTS
import ImageUnavailable from "../assets/CTP_Red/CTP_ImageUnavailable.jpg";
import CTPAlphaTowerImg from "../assets/CTP_Alpha_Tower.jpg";
import Image801_1 from "../assets/CTP_Red/CTP_ALPHA/801_802/801_1.jpg";
import Image801_2 from "../assets/CTP_Red/CTP_ALPHA/801_802/801_2.jpg";
import Image801_3 from "../assets/CTP_Red/CTP_ALPHA/801_802/801_3.jpg";
import Image801_4 from "../assets/CTP_Red/CTP_ALPHA/801_802/801_4.jpg";

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
  heroImage: string | any;
  image: string | any;
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
export const ctpAlphaFloorPlans: BuildingFloorPlan[] = [
  { 
    floor: 3, // Floor 3 for units 304 and 307
    units: 2, 
    totalSqm: 14.00, // 7.23 + 6.77
    available: 2, 
    condition: "Warm Shell" 
  },
  { 
    floor: 8, // Floor 8 for units 801 and 802
    units: 2, 
    totalSqm: 22.79, // 10.43 + 12.36
    available: 2, 
    condition: "Bare" 
  }
];

// ===== FLOOR DETAILS DATA =====
export const ctpAlphaFloorDetails: { [key: string]: FloorInfo } = {
  "ctp-alpha-tower-3": {
    buildingId: "ctp-alpha-tower",
    floor: 3,
    totalArea: 150.61,
    availableUnits: 2,
    totalUnits: 2,
    condition: "Warm Shell",
    features: [
      "Mid-level floor with city views",
      "HVAC system in place",
      "Electrical and data ready",
      "Flooring completed",
      "Professional lighting installed",
      "Restroom facilities available"
    ],
    description: ""
  },
  "ctp-alpha-tower-8": {
    buildingId: "ctp-alpha-tower",
    floor: 8,
    totalArea: 245.30,
    availableUnits: 2,
    totalUnits: 2,
    condition: "Bare",
    features: [
      "High floor with panoramic views",
      "Basic building systems",
      "Security access ready",
      "HVAC infrastructure",
      "Electrical and data ready",
      "Natural lighting"
    ],
    description: ""
  }
};

// ===== BUILDING INFORMATION =====
export const ctpAlphaBuildingInfo: BuildingInfo = {
  id: "ctp-alpha-tower",
  name: "CTP Alpha Tower",
  displayName: "CTP Alpha Tower",
  location: "Makati Central Business District",
  shortLocation: "Makati Central Business District",
  description: [
    "Located on Investment Drive within Madrigal Business Park, Alabang, Muntinlupa City, CTP Alpha benefits from its position in one of Metro Manila's premier business hubs. Madrigal Business Park is recognized for its accessibility, modern infrastructure, and a balanced integration of commercial and lifestyle spaces.",
    "The estate also provides essential business support services and boasts a diverse tenant mix, fostering a vibrant and dynamic environment for local enterprises and international corporations alike.",
    "CTP Alpha is classified as a Class B building, completed in 2014 by CTP R.E.D. 1 Corp. This 12-storey structure offers a typical floor area of 454.59 square meters, providing a range of office units for lease. A notable feature is the inclusion of retail spaces on the ground floor, offering convenient amenities for tenants and visitors."
  ],
  stats: {
    totalFloors: 2, // Floor 3 and Floor 8
    totalUnits: 4, // 304, 307, 801, 802
    occupancyRate: 0,
    availableUnits: 4
  },
  buildingHours: {
    weekdays: "5:30 AM - 11:00 PM",
    saturday: "7:00 AM - 9:00 PM",
    sunday: "9:00 AM - 7:00 PM",
    security: "24/7"
  },
  contact: {
    phone: "(555) 234-ALPHA",
    email: "alpha@ctpredcorp.com",
    address: "Makati Central Business District"
  },
  buildingFeatures: [
    { title: "Ultra-Fast Internet", description: "1Gbps+ fiber optic connectivity" },
    { title: "Advanced Security", description: "Biometric access and 24/7 monitoring" },
    { title: "Premium Parking", description: "Underground parking with EV charging" },
    { title: "Executive Lounge", description: "Premium café and networking spaces" },
    { title: "Wellness Center", description: "State-of-the-art fitness facilities" },
    { title: "Conference Suites", description: "Professional meeting and event spaces" }
  ],
  floorPlans: ctpAlphaFloorPlans,
  heroImage: CTPAlphaTowerImg,
  image: CTPAlphaTowerImg,
  badge: "Alpha Class Building",
  ctaTitle: "Experience Alpha-Class Excellence",
  ctaDescription: "Join the elite companies that have chosen CTP Alpha Tower as their headquarters. Contact us today to schedule a private tour and discover premium office solutions."
};

// ===== UNIT DATA =====
export const ctpAlphaUnits: { [key: string]: Unit } = {
  "CAT-304": {
    id: "CAT-304",
    title: "3rd Floor (Unit 304)",
    building: "CTP Alpha Tower",
    location: "Makati Central Business District",
    floor: 3,
    size: 7.23,
    capacity: 3,
    price: 3003,
    status: "Available",
    condition: "Warm Shell",
    image: ImageUnavailable,
    images: [
      ImageUnavailable,
    ],
    description: "Compact office space perfect for small teams in the heart of Makati CBD.",
    floorPlan: {
      totalArea: 7.23,
      privateOffices: 1,
      openWorkspace: 1,
      meetingRooms: 0,
      bathrooms: 1,
      kitchenette: false,
      storage: false
    },
    availability: {
      availableFrom: "Available Now",
      leaseTerms: ["1 year", "2 years"],
      includedUtilities: ["Internet", "Security", "HVAC"],
      additionalCosts: ["Parking: ₱250/month"]
    }
  },
  "CAT-307": {
    id: "CAT-307",
    title: "3rd Floor (Unit 307)",
    building: "CTP Alpha Tower",
    location: "Makati Central Business District",
    floor: 3,
    size: 6.77,
    capacity: 3,
    price: 3004,
    status: "Available",
    condition: "Warm Shell",
    image: ImageUnavailable,
    images: [
      ImageUnavailable
    ],
    description: "Efficient business suite ideal for startups and small enterprises in Makati.",
    floorPlan: {
      totalArea: 6.77,
      privateOffices: 1,
      openWorkspace: 1,
      meetingRooms: 0,
      bathrooms: 1,
      kitchenette: false,
      storage: false
    },
    availability: {
      availableFrom: "Available Now",
      leaseTerms: ["1 year", "2 years"],
      includedUtilities: ["Internet", "Security", "HVAC"],
      additionalCosts: ["Parking: ₱250/month"]
    }
  },
  "CAT-801": {
    id: "CAT-801",
    title: "8th Floor (Unit 801)",
    building: "CTP Alpha Tower",
    location: "Makati Central Business District",
    floor: 8,
    size: 10.43,
    capacity: 4,
    price: 3001,
    status: "Available",
    condition: "Bare",
    image: Image801_1,
    images: [
      Image801_1,
      Image801_2,
      Image801_3,
      Image801_4
    ],
    description: "High floor executive office with excellent views and customizable bare shell condition.",
    floorPlan: {
      totalArea: 10.43,
      privateOffices: 1,
      openWorkspace: 1,
      meetingRooms: 1,
      bathrooms: 1,
      kitchenette: true,
      storage: true
    },
    availability: {
      availableFrom: "Available Now",
      leaseTerms: ["1 year", "2 years", "3 years"],
      includedUtilities: ["Security"],
      additionalCosts: ["HVAC: ₱150/month", "Parking: ₱300/month"]
    }
  },
  "CAT-802": {
    id: "CAT-802",
    title: "8th Floor (Unit 802)",
    building: "CTP Alpha Tower",
    location: "Makati Central Business District",
    floor: 8,
    size: 12.36,
    capacity: 5,
    price: 3002,
    status: "Available",
    condition: "Bare",
    image: Image801_1,
    images: [
      Image801_1,
      Image801_2,
      Image801_3,
      Image801_4
    ],
    description: "Premium office space on the 8th floor with panoramic city views and flexible layout options.",
    floorPlan: {
      totalArea: 12.36,
      privateOffices: 2,
      openWorkspace: 1,
      meetingRooms: 1,
      bathrooms: 1,
      kitchenette: true,
      storage: true
    },
    availability: {
      availableFrom: "Available Now",
      leaseTerms: ["1 year", "2 years", "3 years"],
      includedUtilities: ["Security"],
      additionalCosts: ["HVAC: ₱150/month", "Parking: ₱300/month"]
    }
  }
};

// ===== HELPER FUNCTIONS =====

// Get floor plans for CTP Alpha Tower
export const getCtpAlphaFloorPlans = (): BuildingFloorPlan[] => {
  return ctpAlphaFloorPlans;
};

// Get floor details for CTP Alpha Tower
export const getCtpAlphaFloorDetails = (): { [key: string]: FloorInfo } => {
  return ctpAlphaFloorDetails;
};

// Get specific floor detail by floor number
export const getCtpAlphaFloorDetail = (floor: number): FloorInfo | null => {
  const key = `ctp-alpha-tower-${floor}`;
  return ctpAlphaFloorDetails[key] || null;
};

// Get total area for CTP Alpha Tower
export const getCtpAlphaTotalArea = (): number => {
  return ctpAlphaFloorPlans.reduce((total, plan) => total + plan.totalSqm, 0);
};

// Get available floors for CTP Alpha Tower
export const getCtpAlphaAvailableFloors = (): number[] => {
  return ctpAlphaFloorPlans
    .filter(plan => plan.available > 0)
    .map(plan => plan.floor);
};