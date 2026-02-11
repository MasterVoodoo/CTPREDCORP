// This file has been consolidated into ctpData.ts - please delete this file
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
  badge: string;
  ctaTitle: string;
  ctaDescription: string;
}

export interface FeaturedListing {
  id: number;
  unitId: string;
  title: string;
  building: string;
  location: string;
  size: string;
  capacity: string;
  price: string;
  image: string;
  status: string;
}

// ===== BUILDING DATA =====
export const buildings: { [key: string]: BuildingInfo } = {
  "ctp-red-corp": {
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
      phone: "(555) 123-CORP",
      email: "leasing@ctpredcorp.com",
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
    floorPlans: [
      { floor: 1, units: 1, totalSqft: 1200, available: 1, condition: "Fitted" }
    ],
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "Premium Location",
    ctaTitle: "Explore Premium Office Solutions",
    ctaDescription: "Discover the perfect workspace for your business in our modern facility with state-of-the-art amenities and prime location."
  },
  "ctp-alpha-tower": {
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
      totalFloors: 1,
      totalUnits: 1,
      occupancyRate: 0,
      availableUnits: 1
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
    floorPlans: [
      { floor: 1, units: 1, totalSqft: 1400, available: 1, condition: "Warm Shell" }
    ],
    heroImage: "https://images.unsplash.com/photo-1573852858648-0290e8b1f3e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "Alpha Class Building",
    ctaTitle: "Experience Alpha-Class Excellence",
    ctaDescription: "Join the elite companies that have chosen CTP Alpha Tower as their headquarters. Contact us today to schedule a private tour and discover premium office solutions."
  },
  "ctp-bf-building": {
    id: "ctp-bf-building",
    name: "CTP BF Building",
    displayName: "CTP BF Building",
    location: "Bonifacio Global City",
    shortLocation: "Bonifacio Global City",
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
      address: "Bonifacio Global City"
    },
    buildingFeatures: [
      { title: "Reliable Internet", description: "High-speed fiber connectivity" },
      { title: "Complete Security", description: "Round-the-clock security services" },
      { title: "Parking Available", description: "Ample parking spaces for tenants" },
      { title: "Business Lounge", description: "Comfortable common areas and café" },
      { title: "Fitness Facilities", description: "On-site gym and wellness center" },
      { title: "Meeting Spaces", description: "Shared conference and meeting rooms" }
    ],
    floorPlans: [
      { floor: 1, units: 1, totalSqft: 1300, available: 1, condition: "Bare" }
    ],
    heroImage: "https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "BGC Prime Location",
    ctaTitle: "Ready to Join BGC's Business Community?",
    ctaDescription: "Experience the convenience and connectivity of working in Bonifacio Global City. Contact us today to schedule a tour of CTP BF Building and explore your options."
  }
};

// ===== UNIT DATA =====
export const units: { [key: string]: Unit } = {
  "CRC-101": {
    id: "CRC-101",
    title: "Ground Floor Executive Suite",
    building: "CTP Asean Tower",
    location: "Filinvest City, Alabang, Muntinlupa",
    floor: 1,
    size: 1200,
    capacity: 8,
    price: 3500,
    status: "Available",
    condition: "Fitted",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549037328-5d1b75eaa704?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    description: "This ground floor executive suite offers exceptional convenience with direct access and premium finishes. Perfect for established businesses seeking a professional environment with easy client access.",
    floorPlan: {
      totalArea: 1200,
      privateOffices: 3,
      openWorkspace: 1,
      meetingRooms: 1,
      bathrooms: 2,
      kitchenette: true,
      storage: true
    },
    availability: {
      availableFrom: "Immediate",
      leaseTerms: ["6 months", "1 year", "2 years", "3 years"],
      includedUtilities: ["Internet", "Security", "Cleaning", "HVAC"],
      additionalCosts: ["Parking: $150/month", "After-hours HVAC: $50/month"]
    }
  },
  "CAT-102": {
    id: "CAT-102",
    title: "Alpha Executive Ground Floor",
    building: "CTP Alpha Tower",
    location: "Makati Central Business District",
    floor: 1,
    size: 1400,
    capacity: 10,
    price: 3800,
    status: "Available",
    condition: "Warm Shell",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1573852858648-0290e8b1f3e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549037328-5d1b75eaa704?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    description: "Premium ground floor executive space in Makati's most prestigious business district. Features state-of-the-art facilities and direct street access for maximum convenience.",
    floorPlan: {
      totalArea: 1400,
      privateOffices: 3,
      openWorkspace: 1,
      meetingRooms: 2,
      bathrooms: 2,
      kitchenette: true,
      storage: true
    },
    availability: {
      availableFrom: "Available Now",
      leaseTerms: ["1 year", "2 years", "3 years"],
      includedUtilities: ["Premium Internet", "Security", "Concierge", "HVAC"],
      additionalCosts: ["Executive services: ₱200/month"]
    }
  },
  "CBF-103": {
    id: "CBF-103",
    title: "BGC Modern Office Suite",
    building: "CTP BF Building",
    location: "Bonifacio Global City",
    floor: 1,
    size: 1300,
    capacity: 9,
    price: 3600,
    status: "Available",
    condition: "Bare",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549037328-5d1b75eaa704?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    description: "Modern street-level office in the heart of BGC's dynamic business district. Perfect for companies that value accessibility and the vibrant BGC lifestyle.",
    floorPlan: {
      totalArea: 1300,
      privateOffices: 3,
      openWorkspace: 1,
      meetingRooms: 1,
      bathrooms: 2,
      kitchenette: true,
      storage: false
    },
    availability: {
      availableFrom: "February 15, 2024",
      leaseTerms: ["6 months", "1 year", "2 years"],
      includedUtilities: ["Internet", "Security", "Cleaning", "HVAC"],
      additionalCosts: ["BGC parking: $200/month", "Storage (off-site): $75/month"]
    }
  }
};

// ===== FEATURED LISTINGS =====
export const featuredListings: FeaturedListing[] = [
  {
    id: 1,
    unitId: "ctp-alpha-tower",
    title: "CTP Alpha Tower",
    building: "1709 Investment Dr, Muntinlupa",
    location: "1 floor",
    size: "1,400 sq ft",
    capacity: "10 people",
    price: "$3,800/month",
    image: "https://images.unsplash.com/photo-1573852858648-0290e8b1f3e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: "Available"
  },
  {
    id: 2,
    unitId: "ctp-red-corp",
    title: "CTP Asean Tower",
    building: "Asean Drive, Alabang, Muntinlupa",
    location: "1 floor",
    size: "1,200 sq ft",
    capacity: "8 people",
    price: "$3,500/month",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: "Available"
  },
  {
    id: 3,
    unitId: "ctp-bf-building",
    title: "CTP BF Building",
    building: "Bonifacio Global City",
    location: "1 floor",
    size: "1,300 sq ft",
    capacity: "9 people",
    price: "$3,600/month",
    image: "https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: "Available"
  }
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
  const allUnits = getPublicUnits(); // Use public units to exclude Unavailable
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
  const allUnits = getAllUnits(); // Use all units including Unavailable
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

// Get units by floor for a specific building (excludes Unavailable)
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

// Validate unit data structure
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

// Validate building data structure
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