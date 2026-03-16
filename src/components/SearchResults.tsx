import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, MapPin, Building2, Square, Hotel } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { getUnitsByBuilding, getBuildingById, Unit, getPublicUnits } from "../data/ctpData";
import { getFloorDisplayName } from "../utils/floorDisplay";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SearchResultsProps {
  buildingId: string;
  floor?: number;
  condition?: string;
  onBack: () => void;
  onViewDetails: (unitId: string) => void;
}

export default function SearchResults({ 
  buildingId, 
  floor, 
  condition,
  onBack, 
  onViewDetails 
}: SearchResultsProps) {
  const [loading, setLoading] = useState(true);

  const building = useMemo(() => getBuildingById(buildingId), [buildingId]);

  // Dynamically filter units based on search criteria
  const filteredUnits = useMemo(() => {
    setLoading(true);
    
    let units: Unit[] = [];
    
    // If building is specified, get units for that building
    if (buildingId && buildingId !== "all") {
      units = getUnitsByBuilding(buildingId);
    } else {
      // If no building specified, get all public units
      units = getPublicUnits();
    }
    
    // Filter by floor if specified
    if (floor !== undefined && floor !== null) {
      units = units.filter(unit => unit.floor === floor);
    }
    
    // Filter by condition if specified
    if (condition && condition !== "" && condition !== "all") {
      units = units.filter(unit => unit.condition === condition);
    }
    
    setLoading(false);
    return units;
  }, [buildingId, floor, condition]);

  // Get statistics dynamically
  const stats = useMemo(() => {
    const available = filteredUnits.filter(u => u.status === 'Available').length;
    const comingSoon = filteredUnits.filter(u => u.status === 'Coming Soon').length;
    const taken = filteredUnits.filter(u => u.status === 'Taken').length;
    
    return { available, comingSoon, taken };
  }, [filteredUnits]);

  // Get condition badge color dynamically
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

  // Get status badge variant dynamically
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "Available":
        return "default";
      case "Coming Soon":
        return "secondary";
      case "Taken":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Results Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-white hover:bg-primary cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Search</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Search Results
              </h1>
              <div className="flex items-center space-x-2 text-gray-600 mt-1">
                <MapPin className="h-4 w-4" />
                <span>
                  {building?.displayName || "All Buildings"}
                  {floor !== undefined && floor !== null && ` - ${getFloorDisplayName(floor)}`}
                  {condition && condition !== "all" && ` - ${condition}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="container mx-auto px-4 py-8">
        {filteredUnits.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No units found
            </h2>
            <p className="text-gray-600 mb-6">
              There are no units matching your search criteria.
              {floor !== undefined && floor !== null && ` Try searching for a different floor`}
              {condition && condition !== "all" && ` or condition`}
              {building && ` at ${building.displayName}`}.
            </p>
            <div className="space-x-4">
              <Button onClick={onBack} variant="outline" className="cursor-pointer">
                Try Different Search
              </Button>
              {building && (
                <Button 
                  onClick={() => window.location.hash = `#${buildingId}`}
                  className="bg-primary hover:bg-primary/90 cursor-pointer"
                >
                  View All {building.displayName} Units
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {filteredUnits.length} {filteredUnits.length === 1 ? 'Unit' : 'Units'} Found
                </h2>
                <p className="text-gray-600">
                  {building?.displayName || "All Buildings"}
                  {floor !== undefined && floor !== null && ` • ${getFloorDisplayName(floor)}`}
                  {condition && condition !== "all" && ` • ${condition}`}
                  {building?.location && ` • ${building.location}`}
                </p>
              </div>
              <div className="text-right">
                {stats.available > 0 && (
                  <p className="text-sm text-gray-600">
                    {stats.available} Available
                  </p>
                )}
                {stats.comingSoon > 0 && (
                  <p className="text-sm text-gray-600">
                    {stats.comingSoon} Coming Soon
                  </p>
                )}
                {stats.taken > 0 && (
                  <p className="text-sm text-gray-600">
                    {stats.taken} Taken
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUnits.map((unit) => (
                <Card key={unit.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <ImageWithFallback
                      src={unit.image}
                      alt={unit.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge 
                      variant={getStatusVariant(unit.status)}
                      className="absolute top-4 right-4"
                    >
                      {unit.status}
                    </Badge>
                    <Badge className={`absolute top-4 left-4 ${getConditionColor(unit.condition)}`}>
                      {unit.condition}
                    </Badge>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                        {unit.title}
                      </h3>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                        {building?.displayName || unit.building}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Hotel className="h-4 w-4 mr-2 flex-shrink-0" />
                        {getFloorDisplayName(unit.floor)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Square className="h-4 w-4 mr-2 flex-shrink-0" />
                        {unit.size.toLocaleString()} sq m
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        {unit.location}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          ₱{unit.price.toLocaleString()}
                        </span>
                        <p className="text-sm text-gray-500">per sqm</p>
                      </div>
                      
                      <Button
                        onClick={() => onViewDetails(unit.id)}
                        className="bg-primary hover:bg-primary/90 cursor-pointer"
                        disabled={unit.status === "Taken"}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}