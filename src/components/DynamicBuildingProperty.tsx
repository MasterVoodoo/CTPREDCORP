import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Square, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "framer-motion";

interface Building {
  id: string;
  name: string;
  display_name?: string;
  location?: string;
  short_location?: string;
  description?: string | string[];
  stats?: any;
  building_hours?: any;
  contact?: any;
  hero_image?: string;
  badge?: string;
  building_features?: any;
}

interface Unit {
  id: string;
  title: string;
  building: string;
  location: string;
  floor: number;
  size: number;
  capacity: number;
  price: number;
  status: string;
  condition: string;
  image: string;
}

interface DynamicBuildingPropertyProps {
  buildingId: string;
  onBack: () => void;
  onViewDetails?: (unitId: string) => void;
}

export default function DynamicBuildingProperty({ buildingId, onBack, onViewDetails }: DynamicBuildingPropertyProps) {
  const [building, setBuilding] = useState<Building | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("units");

  // Default building features (copied from other view details pages)
  const defaultBuildingFeatures = [
    {
      title: "Prime Location",
      description: "Strategically located in a major business district with easy access to transportation."
    },
    {
      title: "24/7 Security",
      description: "Round-the-clock security personnel and modern surveillance systems ensure safety."
    },
    {
      title: "High-Speed Elevators",
      description: "Modern elevator systems with minimal wait time for efficient vertical transportation."
    },
    {
      title: "Backup Power",
      description: "Uninterruptible power supply and generator backup for business continuity."
    },
    {
      title: "Modern Infrastructure",
      description: "State-of-the-art facilities with fiber optic internet and modern HVAC systems."
    },
    {
      title: "Ample Parking",
      description: "Dedicated parking spaces for tenants and visitors with 24/7 access."
    }
  ];

  useEffect(() => {
    fetchBuildingData();
  }, [buildingId]);

  const fetchBuildingData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch building details
      const buildingResponse = await fetch(`http://localhost:5000/api/buildings/${buildingId}`);
      if (!buildingResponse.ok) {
        throw new Error('Building not found');
      }
      const buildingData = await buildingResponse.json();
      setBuilding(buildingData);

      // Fetch units for this building
      const unitsResponse = await fetch('http://localhost:5000/api/units');
      if (unitsResponse.ok) {
        const allUnits = await unitsResponse.json();
        // Filter units that belong to this building
        const buildingUnits = allUnits.filter((unit: Unit) => unit.building === buildingId);
        setUnits(buildingUnits);
      }
    } catch (err: any) {
      console.error('Error fetching building data:', err);
      setError(err.message || 'Failed to load building');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '/images/buildings/default.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const parseStats = (stats: any) => {
    if (typeof stats === 'string') {
      try {
        return JSON.parse(stats);
      } catch {
        return {};
      }
    }
    return stats || {};
  };

  const parseDescription = (description: any): string[] => {
    if (Array.isArray(description)) return description;
    if (typeof description === 'string') {
      try {
        const parsed = JSON.parse(description);
        return Array.isArray(parsed) ? parsed : [description];
      } catch {
        return [description];
      }
    }
    return [];
  };

  const parseContact = (contact: any) => {
    if (typeof contact === 'string') {
      try {
        return JSON.parse(contact);
      } catch {
        return {};
      }
    }
    return contact || {};
  };

  const parseBuildingHours = (hours: any) => {
    if (typeof hours === 'string') {
      try {
        return JSON.parse(hours);
      } catch {
        return {};
      }
    }
    return hours || {};
  };

  const parseBuildingFeatures = (features: any): any[] => {
    if (Array.isArray(features)) return features;
    if (typeof features === 'string') {
      try {
        const parsed = JSON.parse(features);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500 text-white";
      case "Unavailable":
        return "bg-gray-500 text-white";
      case "Taken":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading building...</p>
        </div>
      </div>
    );
  }

  if (error || !building) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">⚠️ {error || 'Building not found'}</p>
          <Button onClick={onBack} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const displayName = building.display_name || building.name;
  const shortLocation = building.short_location || building.location || 'Location not specified';
  const description = parseDescription(building.description);
  const stats = parseStats(building.stats);
  const contact = parseContact(building.contact);
  const buildingHours = parseBuildingHours(building.building_hours);
  const buildingFeatures = parseBuildingFeatures(building.building_features);
  
  // Use default features if none provided in database
  const displayFeatures = buildingFeatures.length > 0 ? buildingFeatures : defaultBuildingFeatures;

  const totalFloors = stats.totalFloors || '0';
  const totalUnits = stats.totalUnits || '0';
  const occupancyRate = stats.occupancyRate || '0';
  const availableUnits = stats.availableUnits || '0';

  const availableUnitsList = units.filter(unit => unit.status === 'Available');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-white hover:bg-primary cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{shortLocation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="relative">
            <ImageWithFallback
              src={getImageUrl(building.hero_image)}
              alt={`${displayName} Building`}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            {building.badge && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-white">{building.badge}</Badge>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {displayName}
            </h2>
            <div className="text-lg space-y-4 text-gray-600 mb-6">
              {description.length > 0 ? (
                description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>Welcome to {displayName}. Contact us for more information about available office spaces.</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary">{totalFloors}</div>
                <div className="text-sm text-gray-600">Total Floors</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary">{totalUnits}</div>
                <div className="text-sm text-gray-600">Office Units</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary">{occupancyRate}%</div>
                <div className="text-sm text-gray-600">Occupancy Rate</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary">{availableUnits}</div>
                <div className="text-sm text-gray-600">Available Units</div>
              </div>
            </div>
            <Button 
              className="bg-primary hover:bg-accent text-white w-full cursor-pointer"
              onClick={() => {
                window.location.hash = "#schedule-appointment";
              }}
            >
              Schedule Building Tour
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="relative grid w-full grid-cols-2 cursor-pointer bg-gray-100 border border-gray-300 rounded-lg p-1.5 shadow-sm h-14 mb-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <TabsTrigger
                value="units"
                className="relative text-base font-medium cursor-pointer transition-all duration-200 data-[state=active]:bg-transparent w-full h-full"
                style={{ 
                  color: activeTab === "units" ? 'white' : undefined
                }}
              >
                <motion.span 
                  className="relative z-10"
                  animate={{ 
                    scale: activeTab === "units" ? 1.05 : 1,
                    fontWeight: activeTab === "units" ? 600 : 500
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Available Units
                </motion.span>
              </TabsTrigger>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <TabsTrigger
                value="building"
                className="relative text-base font-medium cursor-pointer transition-all duration-200 data-[state=active]:bg-transparent w-full h-full"
                style={{ 
                  color: activeTab === "building" ? 'white' : undefined
                }}
              >
                <motion.span 
                  className="relative z-10"
                  animate={{ 
                    scale: activeTab === "building" ? 1.05 : 1,
                    fontWeight: activeTab === "building" ? 600 : 500
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Building Info
                </motion.span>
              </TabsTrigger>
            </motion.div>
            <motion.div
              className="absolute bg-primary rounded-md shadow-lg"
              style={{
                top: '6px',
                bottom: '6px',
                left: activeTab === "units" ? '6px' : '50%',
                right: activeTab === "units" ? '50%' : '6px'
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30
              }}
            />
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="units" className="space-y-6" key="units">
              {activeTab === "units" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {availableUnitsList.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {availableUnitsList.map((unit) => (
                        <Card key={unit.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative">
                            <ImageWithFallback
                              src={getImageUrl(unit.image)}
                              alt={`Unit ${unit.id}`}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-3 right-3">
                              <Badge className={getStatusColor(unit.status)}>
                                {unit.status}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-lg font-bold text-gray-900">{unit.title}</h3>
                              <span className="text-sm text-gray-500">Floor {unit.floor}</span>
                            </div>
                            
                            <div className="mb-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Square className="h-4 w-4 mr-1" />
                                {unit.size} sq m
                              </div>
                            </div>

                            {unit.condition && (
                              <div className="mb-4">
                                <span className="text-xs text-gray-500">Condition: </span>
                                <Badge 
                                  className={`text-xs ${
                                    unit.condition === 'Fitted' 
                                      ? 'bg-green-100 text-green-800 border-green-300' 
                                      : unit.condition === 'Warm Shell'
                                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                      : 'bg-blue-100 text-blue-800 border-blue-300'
                                  }`}
                                >
                                  {unit.condition}
                                </Badge>
                              </div>
                            )}

                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-2xl font-bold text-primary">
                                  ₱{unit.price.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500">per month</div>
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-primary hover:bg-accent text-white cursor-pointer"
                                onClick={() => onViewDetails?.(unit.id)}
                              >
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                      <div className="mb-4">
                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">No Units Available</h3>
                      <p className="text-gray-600 mb-6">There are currently no available units in this building. Check back later or contact us for future availability.</p>
                      <Button 
                        className="bg-primary hover:bg-accent text-white cursor-pointer"
                        onClick={() => window.location.hash = "#contact"}
                      >
                        Contact Us
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="building" className="space-y-6" key="building">
              {activeTab === "building" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Building Features</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {displayFeatures.map((feature: any, index: number) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-6">
                      {contact.phone || contact.email || contact.address ? (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Property Management</h4>
                          <div className="space-y-3">
                            {contact.phone && (
                              <div className="flex items-center text-gray-600">
                                <Phone className="h-4 w-4 mr-2" />
                                <span>{contact.phone}</span>
                              </div>
                            )}
                            {contact.email && (
                              <div className="flex items-center text-gray-600">
                                <Mail className="h-4 w-4 mr-2" />
                                <span>{contact.email}</span>
                              </div>
                            )}
                            {contact.address && (
                              <div className="flex items-center text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{contact.address}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Property Management</h4>
                          <p className="text-gray-600">Contact information coming soon.</p>
                        </div>
                      )}

                      {(buildingHours.weekdays || buildingHours.security) && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Building Hours</h4>
                          <div className="space-y-2 text-gray-600">
                            {buildingHours.weekdays && (
                              <div className="flex justify-between">
                                <span>Weekdays</span>
                                <span>{buildingHours.weekdays}</span>
                              </div>
                            )}
                            {buildingHours.security && (
                              <div className="flex justify-between">
                                <span>Security</span>
                                <span>{buildingHours.security}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}