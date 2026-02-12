import React from "react";
import { useState } from "react";
import { ArrowLeft, MapPin, Calendar, Square, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getUnitsByBuilding, getBuildingById } from "../data/ctpData";
import { motion } from "framer-motion";

interface CtpRedCorpPropertyProps {
  onBack: () => void;
  onViewDetails?: (unitId: string) => void;
}

export default function CtpRedCorpProperty({ onBack, onViewDetails }: CtpRedCorpPropertyProps) {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("units");

  // Get building and units data from centralized sources
  const building = getBuildingById("ctp-red-corp");
  const availableUnits = getUnitsByBuilding("ctp-red-corp");
  
  // Get unique floors from available units
  const uniqueFloors = [...new Set(availableUnits.map(unit => unit.floor))].sort((a, b) => a - b);
  
  // Helper function to get floor display name
  const getFloorDisplayName = (floor: number): string => {
    if (floor === 0) return "Ground Floor";
    if (floor === 13) return "Lower Penthouse";
    if (floor === 14) return "Upper Penthouse";
    return `Floor ${floor}`;
  };

  const tabs = [
    { id: "units", label: "Available Units" },
    { id: "building", label: "Building Info" },
    { id: "floor-plans", label: "Floor Plans" }
  ];

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
              Premier Office Spaces in the Heart of the City
            </h2>
            <div className="text-lg space-y-4 text-gray-600 mb-6">
              {building.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary">{building.stats.totalFloors}</div>
                <div className="text-sm text-gray-600">Total Floors</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary">{building.stats.totalUnits}</div>
                <div className="text-sm text-gray-600">Office Units</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary">{building.stats.occupancyRate}%</div>
                <div className="text-sm text-gray-600">Occupancy Rate</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary">{building.stats.availableUnits}</div>
                <div className="text-sm text-gray-600">Available Units</div>
              </div>
            </div>
            <Button className="bg-primary hover:bg-accent text-white w-full cursor-pointer">
              Schedule Building Tour
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="relative grid w-full grid-cols-3 cursor-pointer bg-gray-100 border border-gray-300 rounded-lg p-1 shadow-sm">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="relative text-sm font-medium cursor-pointer transition-colors duration-200 hover:text-gray-900"
                style={{ 
                  color: activeTab === tab.id ? 'white' : undefined,
                  zIndex: 10
                }}
              >
                <span className="relative z-20">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-md shadow-lg"
                    style={{ zIndex: -1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="units" className="space-y-6">
            {/* Floor Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedFloor === null ? "default" : "outline"}
                onClick={() => setSelectedFloor(null)}
                size="sm"
                className="cursor-pointer"
              >
                All Floors
              </Button>
              {uniqueFloors.map((floor) => (
                <Button
                  key={floor}
                  variant={selectedFloor === floor ? "default" : "outline"}
                  onClick={() => setSelectedFloor(floor)}
                  size="sm"
                  className="cursor-pointer"
                >
                  {getFloorDisplayName(floor)}
                </Button>
              ))}
            </div>

            {/* Units Grid */}
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
                      <span className="text-sm text-gray-500">{getFloorDisplayName(unit.floor)}</span>
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
                        <div className="text-xs text-gray-500">per month</div>
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
          </TabsContent>

          <TabsContent value="building" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="floor-plans" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {building.floorPlans.map((floor) => (
                <Card key={floor.floor} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {getFloorDisplayName(floor.floor)}
                      <Badge variant="outline">{floor.available} Available</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Units:</span>
                        <span className="font-semibold">{floor.units}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Area:</span>
                        <span className="font-semibold">{floor.totalSqm.toLocaleString()} sq m</span>
                      </div>
                      {floor.condition && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Condition:</span>
                          <Badge 
                            className={`text-xs ${
                              floor.condition === 'Fitted' 
                                ? 'bg-green-100 text-green-800 border-green-300' 
                                : floor.condition === 'Warm Shell'
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                : 'bg-blue-100 text-blue-800 border-blue-300'
                            }`}
                          >
                            {floor.condition}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <Button 
                      className="w-full mt-4 cursor-pointer" 
                      variant="outline"
                      onClick={() => setSelectedFloor(floor.floor)}
                    >
                      View {getFloorDisplayName(floor.floor)} Units
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}