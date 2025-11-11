import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Users, Building2, Square } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { getUnitsByBuilding, getBuildingById, Unit } from "../data/ctpData";

interface SearchResultsProps {
  buildingId: string;
  floor: number;
  onBack: () => void;
  onViewDetails: (unitId: string) => void;
}

export default function SearchResults({ 
  buildingId, 
  floor, 
  onBack, 
  onViewDetails 
}: SearchResultsProps) {
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  const building = getBuildingById(buildingId);

  useEffect(() => {
    setLoading(true);
    
    // Get units for the specified building and floor
    const buildingUnits = getUnitsByBuilding(buildingId);
    const floorUnits = buildingUnits.filter(unit => unit.floor === floor);
    
    setFilteredUnits(floorUnits);
    setLoading(false);
  }, [buildingId, floor]);

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
              className="flex items-center space-x-2 text-gray-600 hover:text-white hover:bg-primary"
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
                <span>{building?.displayName} - Floor {floor}</span>
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
              There are no units available on Floor {floor} at {building?.displayName}. 
              Try searching for a different floor or building.
            </p>
            <div className="space-x-4">
              <Button onClick={onBack} variant="outline">
                Try Different Search
              </Button>
              <Button 
                onClick={() => window.location.hash = `#${buildingId}`}
                className="bg-primary hover:bg-primary/90"
              >
                View All {building?.displayName} Units
              </Button>
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
                  Floor {floor} at {building?.displayName} • {building?.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {filteredUnits.filter(u => u.status === 'Available').length} Available
                </p>
                <p className="text-sm text-gray-600">
                  {filteredUnits.filter(u => u.status === 'Coming Soon').length} Coming Soon
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUnits.map((unit) => (
                <Card key={unit.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={unit.image}
                      alt={unit.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                        {unit.title}
                      </h3>
                      <Badge 
                        variant={unit.status === "Available" ? "default" : 
                                unit.status === "Coming Soon" ? "secondary" : "destructive"}
                        className="ml-2 flex-shrink-0"
                      >
                        {unit.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        Floor {unit.floor}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Square className="h-4 w-4 mr-2 flex-shrink-0" />
                        {unit.size.toLocaleString()} sq ft
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                        Up to {unit.capacity} people
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          ${unit.price.toLocaleString()}
                        </span>
                        <span className="text-gray-600">/month</span>
                      </div>
                      
                      <Button
                        onClick={() => onViewDetails(unit.id)}
                        className="bg-primary hover:bg-primary/90"
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