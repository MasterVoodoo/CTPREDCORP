import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Building, Users, Square } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
  stats?: any;
  hero_image?: string;
  badge?: string;
}

interface PropertiesPageProps {
  onBack: () => void;
  onViewBuilding: (buildingId: string) => void;
}

export default function PropertiesPage({ onBack, onViewBuilding }: PropertiesPageProps) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch buildings and units in parallel
      const [buildingsRes, unitsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/buildings`),
        fetch(`${API_BASE_URL}/api/units`)
      ]);

      if (buildingsRes.ok) {
        const buildingsData = await buildingsRes.json();
        setBuildings(buildingsData);
      }

      if (unitsRes.ok) {
        const unitsData = await unitsRes.json();
        setUnits(unitsData);
      }

      setError(null);
    } catch (err: any) {
      console.error('Error fetching properties data:', err);
      setError(err.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableUnitsCount = (buildingId: string) => {
    return units.filter(
      unit => unit.building === buildingId && unit.status === 'Available'
    ).length;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">⚠️ {error}</p>
          <Button onClick={fetchData} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-white hover:bg-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Our Properties</h1>
              <p className="text-gray-600 mt-1">
                Discover premium office spaces across our portfolio
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            CTP RED CORP Properties
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our collection of modern office buildings, each designed to provide 
            the perfect environment for your business to thrive. Our properties feature 
            state-of-the-art amenities and prime locations.
          </p>
        </div>

        {/* Buildings Grid */}
        <div className="grid lg:grid-cols-1 gap-8 max-w-6xl mx-auto">
          {buildings.map((building) => {
            const availableUnits = getAvailableUnitsCount(building.id);
            const description = parseDescription(building.description);
            const stats = parseStats(building.stats);
            const displayName = building.display_name || building.name;
            const shortLocation = building.short_location || building.location || 'Location TBA';
            const heroImage = building.hero_image || '/images/buildings/default.jpg';
            const badge = building.badge || 'Premium';
            
            return (
              <Card 
                key={building.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => onViewBuilding(building.id)}
              >
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Image Section */}
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={heroImage.startsWith('http') ? heroImage : `${API_BASE_URL}${heroImage}`}
                      alt={`${displayName} Building`}
                      className="w-full h-80 lg:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-white">
                        {badge}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500 text-white">
                        {availableUnits} Available
                      </Badge>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 flex flex-col justify-between">
                    <div>
                      <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                          {displayName}
                        </CardTitle>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-2" />
                          <span className="text-lg">{shortLocation}</span>
                        </div>
                      </CardHeader>

                      <CardContent className="p-0">
                        <div className="space-y-4 mb-6">
                          {description.slice(0, 2).map((paragraph, index) => (
                            <p key={index} className="text-gray-600 leading-relaxed">
                              {paragraph}
                            </p>
                          ))}
                        </div>

                        {/* Building Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <Building className="h-6 w-6 text-primary mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">
                              {stats.totalFloors || stats.total_floors || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-600">Total Floors</div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <Square className="h-6 w-6 text-primary mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">
                              {stats.totalUnits || stats.total_units || units.filter(u => u.building === building.id).length}
                            </div>
                            <div className="text-sm text-gray-600">Office Units</div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">
                              {stats.occupancyRate || stats.occupancy_rate || '0'}%
                            </div>
                            <div className="text-sm text-gray-600">Occupancy Rate</div>
                          </div>
                          <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                            <div className="text-2xl font-bold text-primary">
                              {availableUnits}
                            </div>
                            <div className="text-sm text-primary font-medium">Available Now</div>
                          </div>
                        </div>

                        {/* Key Features */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {(building.buildingFeatures || []).slice(0, 3).map((feature: any, index: number) => (
                              <div key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <span className="font-medium text-gray-900">{feature.title}:</span>
                                  <span className="text-gray-600 ml-1">{feature.description}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4 border-t border-gray-200">
                      <Button 
                        className="w-full bg-primary hover:bg-accent text-white"
                        size="lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewBuilding(building.id);
                        }}
                      >
                        Explore {building.displayName}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center bg-white rounded-lg p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help Choosing the Right Space?
          </h3>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Our leasing specialists are here to help you find the perfect office space 
            that meets your specific business needs and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
              Schedule Consultation
            </Button>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
              Contact Our Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}