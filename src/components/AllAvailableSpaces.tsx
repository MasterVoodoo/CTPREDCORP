import { ArrowLeft, MapPin, Square, Users, Building2, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getUnitsByStatus, getBuildingById } from "../data/ctpData";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface AllAvailableSpacesProps {
  onBack: () => void;
  onViewDetails: (unitId: string) => void;
  initialFilters?: {
    building: string;
    condition: string;
  } | null;
}

export default function AllAvailableSpaces({ onBack, onViewDetails, initialFilters }: AllAvailableSpacesProps) {
  // Convert building name to building ID for filtering
  const getBuildingIdFromName = (buildingName: string) => {
    switch (buildingName) {
      case "ctp-red-corp":
        return "ctp-red-corp";
      case "ctp-alpha-tower":
        return "ctp-alpha-tower";
      case "ctp-bf-building":
        return "ctp-bf-building";
      default:
        return "all";
    }
  };

  const [sortBy, setSortBy] = useState<string>("price-asc");
  const [filterBuilding, setFilterBuilding] = useState<string>(
    initialFilters?.building ? getBuildingIdFromName(initialFilters.building) : "all"
  );
  const [filterCondition, setFilterCondition] = useState<string>(
    initialFilters?.condition || "all"
  );

  // Update filters when initialFilters prop changes
  useEffect(() => {
    if (initialFilters) {
      setFilterBuilding(initialFilters.building ? getBuildingIdFromName(initialFilters.building) : "all");
      setFilterCondition(initialFilters.condition || "all");
    }
  }, [initialFilters]);

  // Get all available units
  const availableUnits = getUnitsByStatus("Available");

  // Apply filters
  let filteredUnits = availableUnits;

  if (filterBuilding !== "all") {
    filteredUnits = filteredUnits.filter(unit => {
      switch (filterBuilding) {
        case "ctp-red-corp":
          return unit.id.startsWith("CRC-");
        case "ctp-alpha-tower":
          return unit.id.startsWith("CAT-");
        case "ctp-bf-building":
          return unit.id.startsWith("CBF-");
        default:
          return true;
      }
    });
  }

  if (filterCondition !== "all") {
    filteredUnits = filteredUnits.filter(unit => unit.condition === filterCondition);
  }

  // Apply sorting
  const sortedUnits = [...filteredUnits].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "size-asc":
        return a.size - b.size;
      case "size-desc":
        return b.size - a.size;
      case "floor-asc":
        return a.floor - b.floor;
      case "floor-desc":
        return b.floor - a.floor;
      default:
        return 0;
    }
  });

  // Get building info for display
  const getBuildingName = (unitId: string) => {
    if (unitId.startsWith("CRC-")) {
      const building = getBuildingById("ctp-red-corp");
      return building?.displayName || "CTP Asean Tower";
    } else if (unitId.startsWith("CAT-")) {
      const building = getBuildingById("ctp-alpha-tower");
      return building?.displayName || "CTP Alpha Tower";
    } else if (unitId.startsWith("CBF-")) {
      const building = getBuildingById("ctp-bf-building");
      return building?.displayName || "CTP BF Building";
    } else {
      return "CTP Tower One";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Fitted":
        return "bg-green-100 text-green-800";
      case "Warm Shell":
        return "bg-yellow-100 text-yellow-800";
      case "Bare":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-primary hover:bg-primary hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-black">All Available Spaces</h1>
              <p className="text-gray-600 mt-1">
                {sortedUnits.length} available office{sortedUnits.length !== 1 ? 's' : ''} across our premium buildings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter & Sort</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Building</label>
                <Select value={filterBuilding} onValueChange={setFilterBuilding}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Buildings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Buildings</SelectItem>
                    <SelectItem value="ctp-red-corp">CTP Asean Tower</SelectItem>
                    <SelectItem value="ctp-alpha-tower">CTP Alpha Tower</SelectItem>
                    <SelectItem value="ctp-bf-building">CTP BF Building</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Condition</label>
                <Select value={filterCondition} onValueChange={setFilterCondition}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conditions</SelectItem>
                    <SelectItem value="Fitted">Fitted</SelectItem>
                    <SelectItem value="Warm Shell">Warm Shell</SelectItem>
                    <SelectItem value="Bare">Bare</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="size-asc">Size: Small to Large</SelectItem>
                    <SelectItem value="size-desc">Size: Large to Small</SelectItem>
                    <SelectItem value="floor-asc">Floor: Low to High</SelectItem>
                    <SelectItem value="floor-desc">Floor: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterBuilding("all");
                    setFilterCondition("all");
                    setSortBy("price-asc");
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Units Grid */}
        {sortedUnits.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No units match your criteria</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedUnits.map((unit) => (
              <Card key={unit.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <ImageWithFallback
                    src={unit.image}
                    alt={unit.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-green-600 text-white">
                    Available
                  </Badge>
                  <Badge className={`absolute top-4 left-4 ${getConditionColor(unit.condition)}`}>
                    {unit.condition}
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl font-bold text-black">{unit.title}</CardTitle>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Building2 className="h-4 w-4 mr-2" />
                      <span className="text-sm">{getBuildingName(unit.id)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{unit.location}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <Square className="h-4 w-4 mr-2" />
                      <span className="text-sm">{unit.size.toLocaleString()} sq ft</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm">{unit.capacity} people</span>
                    </div>
                  </div>

                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500">Floor {unit.floor}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        ${unit.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">per month</p>
                    </div>
                    <Button
                      className="bg-primary hover:bg-accent text-white"
                      onClick={() => onViewDetails(unit.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {sortedUnits.length > 0 && (
          <div className="text-center mt-12 py-8 border-t">
            <p className="text-gray-600">
              Showing {sortedUnits.length} of {availableUnits.length} available office{availableUnits.length !== 1 ? 's' : ''}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Ready to take the next step? Contact our leasing team to schedule a tour.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}