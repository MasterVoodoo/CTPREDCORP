import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Square,
  Building,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getUnitById } from "../data/ctpData";

interface UnitDetailsPageProps {
  unitId: string;
  onBack: () => void;
  onScheduleAppointment?: () => void;
}

export default function UnitDetailsPage({
  unitId,
  onBack,
  onScheduleAppointment,
}: UnitDetailsPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const unit = getUnitById(unitId);

  // Function to get back button text based on unit ID
  const getBackButtonText = (unitId: string) => {
    if (unitId.startsWith("CRC-")) {
      return "Back to CTP Asean Tower";
    } else if (unitId.startsWith("CAT-")) {
      return "Back to CTP Alpha Tower";
    } else if (unitId.startsWith("CBF-")) {
      return "Back to CTP BF Building";
    } else if (unitId.startsWith("featured-")) {
      return "Back to Home";
    } else {
      return "Back";
    }
  };

  if (!unit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Unit Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The requested unit could not be found.
          </p>
          <Button
            onClick={onBack}
              className="bg-primary hover:bg-accent text-white cursor-pointer"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-500 text-white";
      case "taken":
        return "bg-red-500 text-white";
      case "unavailable":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Default images if unit doesn't have images
  const unitImages = unit.images || [unit.image];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button and Title */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-white hover:bg-primary cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{getBackButtonText(unitId)}</span>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {unit.title}
              </h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">
                  {unit.building} • {unit.location}
                </span>
              </div>
            </div>
            <div>
              <Badge className={getStatusColor(unit.status)}>
                {unit.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <ImageWithFallback
                src={unitImages[selectedImage]}
                alt={`${unit.title} - View ${selectedImage + 1}`}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute top-4 right-4">
                <Badge className={getStatusColor(unit.status)}>
                  {unit.status}
                </Badge>
              </div>
            </div>

            {/* Image Thumbnails */}
            {unitImages.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {unitImages.map(
                  (image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative rounded-lg overflow-hidden ${
                        selectedImage === index
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`View ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Unit Details */}
          <div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {unit.title}
              </h2>
              {unit.description && (
                <p className="text-gray-600 mb-6">
                  {unit.description}
                </p>
              )}

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Square className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {unit.size.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Square Meters
                  </div>
                </div>
                {unit.condition && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Building className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="mb-2">
                      <Badge 
                        className={`text-sm ${
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
                    <div className="text-sm text-gray-600">
                      Condition
                    </div>
                  </div>
                )}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Building className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {unit.floor === 0 ? "Ground Floor" : `Floor ${unit.floor}`}
                  </div>
                  <div className="text-sm text-gray-600">
                    Location
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    ₱{unit.price.toLocaleString()}
                  </div>
                  <div className="text-gray-600 mb-4">
                    per month
                  </div>
                  <div className="text-sm text-gray-500">
                    Base rent • Additional costs may apply
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-primary hover:bg-accent text-white cursor-pointer"
                  size="lg"
                  onClick={onScheduleAppointment}
                >
                  Schedule Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}