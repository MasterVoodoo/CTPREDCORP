import React from "react";
import { ArrowLeft, MapPin, Square, Building2, Filter, Hotel } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getUnitsByStatus, getBuildingsList, getBuildingById } from "../data/ctpData";
import { getFloorDisplayName } from "../utils/floorDisplay";
import { useState, useEffect, useMemo } from "react";
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
  const [sortBy, setSortBy] = useState<string>("price-asc");
  const [filterBuilding, setFilterBuilding] = useState<string>(
    initialFilters?.building || "all"
  );
  const [filterCondition, setFilterCondition] = useState<string>(
    initialFilters?.condition || "all"
  );

  // Get all available units dynamically
  const availableUnits = useMemo(() => getUnitsByStatus("Available"), []);

  // Dynamically get all buildings
  const buildingsList = useMemo(() => getBuildingsList(), []);

  // Dynamically extract all unique conditions from available units
  const availableConditions = useMemo(() => {
    const conditions = new Set<string>();
    availableUnits.forEach(unit => {
      if (unit.condition) {
        conditions.add(unit.condition);
      }
    });
    return Array.from(conditions).sort();
  }, [availableUnits]);

  // Update filters when initialFilters prop changes
  useEffect(() => {
    if (initialFilters) {
      setFilterBuilding(initialFilters.building || "all");
      setFilterCondition(initialFilters.condition || "all");
    }
  }, [initialFilters]);

  // Apply filters dynamically
  const filteredUnits = useMemo(() => {
    let filtered = availableUnits;

    // Filter by building
    if (filterBuilding !== "all") {
      filtered = filtered.filter(unit => {
        // Extract building prefix from unit ID
        const unitPrefix = unit.id.split('-')[0];
        return filterBuilding === unit.building || unit.id.startsWith(filterBuilding) || 
               (filterBuilding.includes(unitPrefix.toLowerCase()));
      });
    }

    // Filter by condition
    if (filterCondition !== "all") {
      filtered = filtered.filter(unit => unit.condition === filterCondition);
    }

    return filtered;
  }, [availableUnits, filterBuilding, filterCondition]);

  // Apply sorting dynamically
  const sortedUnits = useMemo(() => {
    const sorted = [...filteredUnits];
    
    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "size-asc":
        return sorted.sort((a, b) => a.size - b.size);
      case "size-desc":
        return sorted.sort((a, b) => b.size - a.size);
      case "floor-asc":
        return sorted.sort((a, b) => a.floor - b.floor);
      case "floor-desc":
        return sorted.sort((a, b) => b.floor - a.floor);
      default:
        return sorted;
    }
  }, [filteredUnits, sortBy]);

  // Dynamically get building display name from unit
  const getBuildingDisplayName = (unit: any) => {
    // Try to get building info from the building property
    const building = getBuildingById(unit.building);
    if (building) {
      return building.displayName;
    }
    
    // Fallback: try to extract from unit ID prefix
    const prefix = unit.id.split('-')[0];
    const buildingByPrefix = buildingsList.find(b => 
      b.id.toLowerCase().includes(prefix.toLowerCase())
    );
    
    if (buildingByPrefix) {
      return buildingByPrefix.displayName;
    }
    
    // Final fallback: return the building property directly
    return unit.building || "Unknown Building";
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
              className="text-primary hover:bg-primary hover:text-white cursor-pointer"
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
              {/* Dynamic Building Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Building</label>
                <Select value={filterBuilding} onValueChange={setFilterBuilding}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="All Buildings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="cursor-pointer">All Buildings</SelectItem>
                    {buildingsList.map((building) => (
                      <SelectItem 
                        key={building.id} 
                        value={building.id} 
                        className="cursor-pointer"
                      >
                        {building.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic Condition Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Condition</label>
                <Select value={filterCondition} onValueChange={setFilterCondition}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="All Conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="cursor-pointer">All Conditions</SelectItem>
                    {availableConditions.map((condition) => (
                      <SelectItem 
                        key={condition} 
                        value={condition} 
                        className="cursor-pointer"
                      >
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc" className="cursor-pointer">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc" className="cursor-pointer">Price: High to Low</SelectItem>
                    <SelectItem value="size-asc" className="cursor-pointer">Size: Small to Large</SelectItem>
                    <SelectItem value="size-desc" className="cursor-pointer">Size: Large to Small</SelectItem>
                    <SelectItem value="floor-asc" className="cursor-pointer">Floor: Low to High</SelectItem>
                    <SelectItem value="floor-desc" className="cursor-pointer">Floor: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterBuilding("all");
                    setFilterCondition("all");
                    setSortBy("price-asc");
                  }}
                  className="w-full cursor-pointer"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Units Grid */}
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
                      <span className="text-sm">{getBuildingDisplayName(unit)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{unit.location}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Square className="h-4 w-4 mr-2" />
                    <span className="text-sm">{unit.size.toLocaleString()} sq m</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Hotel className="h-4 w-4 mr-2" />
                    <p className="text-sm text-gray-500">{getFloorDisplayName(unit.floor)}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        ₱{unit.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">per sqm</p>
                    </div>
                    <Button
                      className="bg-primary hover:bg-accent text-white cursor-pointer"
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