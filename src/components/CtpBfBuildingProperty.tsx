import { useState, React } from "react";
import { ArrowLeft, MapPin, Square, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getUnitsByBuilding, getBuildingById } from "../data/ctpData";
import { motion, AnimatePresence } from "framer-motion";

interface CtpBfBuildingPropertyProps {
  onBack: () => void;
  onViewDetails?: (unitId: string) => void;
}

export default function CtpBfBuildingProperty({ onBack, onViewDetails }: CtpBfBuildingPropertyProps) {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("units");

  // Get building and units data from centralized sources
  const building = getBuildingById("ctp-bf-building");
  const availableUnits = getUnitsByBuilding("ctp-bf-building");
  
  // Get all floors from building floor plans (shows all floors, not just those with available units)
  const allFloors = building?.floorPlans.map(fp => fp.floor).sort((a, b) => a - b) || [];

  // Calculate dynamic statistics
  const totalFloors = building?.floorPlans.length || 0;
  const totalUnits = building?.floorPlans.reduce((sum, fp) => sum + fp.units, 0) || 0;
  const totalAvailableUnits = building?.floorPlans.reduce((sum, fp) => sum + fp.available, 0) || 0;
  const totalLeasableArea = building?.floorPlans.reduce((sum, fp) => sum + fp.totalSqm, 0) || 0;
  const totalOccupiedUnits = totalUnits - totalAvailableUnits;
  const occupancyRate = totalUnits > 0 ? Math.round((totalOccupiedUnits / totalUnits) * 100) : 0;

  // Function to get status color styling
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

  if (!building) {
    return <div>Building data not found</div>;
  }

  const filteredUnits = selectedFloor 
    ? availableUnits.filter(unit => unit.floor === selectedFloor)
    : availableUnits;

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
              <h1 className="text-2xl font-bold text-gray-900">{building.displayName}</h1>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{building.shortLocation}</span>
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
              src={building.heroImage}
              alt={`${building.displayName} Building`}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute top-4 right-4">
              <Badge className="bg-primary text-white">{building.badge}</Badge>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Modern Business Hub in BGC
            </h2>
            <div className="text-lg space-y-4 text-gray-600 mb-6">
              {building.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
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
                <div className="text-2xl font-bold text-primary">{totalAvailableUnits}</div>
                <div className="text-sm text-gray-600">Available Units</div>
              </div>
            </div>
            <Button className="bg-primary hover:bg-accent text-white w-full cursor-pointer">
              Schedule Building Tour
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="relative grid w-full grid-cols-2 cursor-pointer bg-gray-100 border border-gray-300 rounded-lg p-1.5 shadow-sm h-14">
            <TabsTrigger
              value="units"
              className="relative text-base font-medium cursor-pointer transition-colors duration-200 hover:text-gray-900 data-[state=active]:bg-transparent"
              style={{ 
                color: activeTab === "units" ? 'white' : undefined
              }}
            >
              <span className="relative z-10">Available Units</span>
            </TabsTrigger>
            <TabsTrigger
              value="building"
              className="relative text-base font-medium cursor-pointer transition-colors duration-200 hover:text-gray-900 data-[state=active]:bg-transparent"
              style={{ 
                color: activeTab === "building" ? 'white' : undefined
              }}
            >
              <span className="relative z-10">Building Info</span>
            </TabsTrigger>
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
                  {/* Units Grid - showing all floors */}
                  {filteredUnits.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUnits.map((unit) => (
                      <Card key={unit.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <ImageWithFallback
                            src={unit.image}
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
                            <h3 className="text-lg font-bold text-gray-900">{unit.id}</h3>
                            <span className="text-sm text-gray-500">{unit.floor === 0 ? "Ground Floor" : `Floor ${unit.floor}`}</span>
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
                                ₱900
                              </div>
                              <div className="text-sm text-gray-500">per sq m</div>
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
                          {building.buildingFeatures.map((feature, index) => (
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
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Building Hours</h4>
                        <div className="space-y-2 text-gray-600">
                          <div className="flex justify-between">
                            <span>Monday - Friday</span>
                            <span>{building.buildingHours.weekdays}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Saturday</span>
                            <span>{building.buildingHours.saturday}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sunday</span>
                            <span>{building.buildingHours.sunday}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Security</span>
                            <span>{building.buildingHours.security}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Property Management</h4>
                        <div className="space-y-3">
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{building.contact.phone}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <span>{building.contact.email}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{building.contact.address}</span>
                          </div>
                        </div>
                      </div>
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