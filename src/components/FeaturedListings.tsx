import {
  MapPin,
  Square,
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
import { featuredListings } from "../data/ctpData";

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
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Featured Office Buildings
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our premium office spaces across three
            exceptional CTP RED CORP buildings. Each space is
            designed for productivity and success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredListings.map((office) => (
            <Card
              key={office.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <ImageWithFallback
                  src={office.image}
                  alt={office.title}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-primary text-white">
                  {office.status}
                </Badge>
              </div>

              <CardHeader className="py-[0px] px-[21px] pt-[5px] pr-[21px] pb-[0px] pl-[21px]">
                <CardTitle className="text-black text-[24px] font-bold text-left">
                  {office.title}
                </CardTitle>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {office.building}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {office.location}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Square className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {office.size}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {office.price}
                    </p>
                    <p className="text-sm text-gray-500">
                      per month
                    </p>
                  </div>
                  <Button
                    className="bg-primary hover:bg-accent text-white"
                    onClick={() =>
                      onViewBuildingProperty?.(office.unitId)
                    }
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white"
            onClick={onViewAllSpaces}
          >
            View All Available Spaces
          </Button>
        </div>
      </div>
    </section>
  );
}