import { useState, useEffect } from "react";
import {
  MapPin,
  Square,
  Building2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Building {
  id: string;
  name: string;
  display_name?: string;
  location?: string;
  short_location?: string;
  description?: string | string[];
  stats?: {
    totalFloors?: number | string;
    totalUnits?: number | string;
    occupancyRate?: number | string;
    availableUnits?: number | string;
  };
  hero_image?: string;
  badge?: string;
}

interface FeaturedListingsProps {
  onViewDetails?: (unitId: string) => void;
  onViewAllSpaces?: () => void;
  onViewBuildingProperty?: (buildingId: string) => void;
}

export default function FeaturedListings({
  onViewDetails,
  onViewAllSpaces,
  onViewBuildingProperty,
}: FeaturedListingsProps) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBuildings();
  }, []);

  // ✅ FIXED: Production-ready API URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ctpred.com.ph';

  const fetchBuildings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/buildings`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch buildings`);
      }
      const data = await response.json();
      setBuildings(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching buildings:', err);
      setError(err.message || 'Failed to load buildings');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Production image URLs
  const getImageUrl = (heroImage?: string) => {
    if (!heroImage) return '/images/buildings/default.jpg';
    if (heroImage.startsWith('http')) return heroImage;
    return `${API_BASE_URL}${heroImage}`;
  };

  const parseStats = (building: Building) => {
    let stats = building.stats;
    if (typeof stats === 'string') {
      try {
        stats = JSON.parse(stats);
      } catch {
        stats = {};
      }
    }
    return stats || {};
  };

  const getStatusText = (building: Building) => {
    const stats = parseStats(building);
    const available = stats.availableUnits || '0';
    return available === '0' || available === 0 ? 'Fully Occupied' : `${available} Available`;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Featured Office Buildings
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our premium office spaces across exceptional CTP RED CORP buildings.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <CardHeader className="py-4 px-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">⚠️ {error}</p>
            <Button onClick={fetchBuildings} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (buildings.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Featured Office Buildings
            </h2>
            <p className="text-gray-600">No buildings available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Featured Office Buildings
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our premium office spaces across {buildings.length} exceptional CTP RED CORP {buildings.length === 1 ? 'building' : 'buildings'}. Each space is designed for productivity and success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {buildings.map((building) => {
            const stats = parseStats(building);
            const displayName = building.display_name || building.name;
            const location = building.location || 'Location not specified';
            const shortLocation = building.short_location || '';
            const statusText = getStatusText(building);
            const totalUnits = stats.totalUnits || '0';
            const totalFloors = stats.totalFloors || '0';

            return (
              <Card
                key={building.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <ImageWithFallback
                    src={getImageUrl(building.hero_image)}
                    alt={displayName}
                    className="w-full h-48 object-cover"
                  />
                  {building.badge && (
                    <Badge className="absolute top-4 left-4 bg-purple-600 text-white">
                      {building.badge}
                    </Badge>
                  )}
                  <Badge className="absolute top-4 right-4 bg-primary text-white">
                    {statusText}
                  </Badge>
                </div>

                <CardHeader className="py-[0px] px-[21px] pt-[5px] pr-[21px] pb-[0px] pl-[21px]">
                  <CardTitle className="text-black text-[24px] font-bold text-left">
                    {displayName}
                  </CardTitle>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">
                        {location}
                      </span>
                    </div>
                    {shortLocation && (
                      <div className="flex items-center text-gray-600">
                        <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">
                          {shortLocation}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <Square className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">
                        {totalFloors} {totalFloors === '1' ? 'Floor' : 'Floors'} · {totalUnits} {totalUnits === '1' ? 'Unit' : 'Units'}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4"> 
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {stats.availableUnits || '0'} units available
                      </p>
                    </div>
                    <Button
                      className="bg-primary hover:bg-accent text-white cursor-pointer"
                      onClick={() => onViewBuildingProperty?.(building.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white cursor-pointer"
            onClick={onViewAllSpaces}
          >
            View All Available Spaces
          </Button>
        </div>
      </div>
    </section>
  );
}
