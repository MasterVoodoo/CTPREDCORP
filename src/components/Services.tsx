import { Shield, Clock, Headphones, Zap, Car, Coffee, Wifi, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const services = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: "24/7 Security",
    description: "Round-the-clock security monitoring and access control for complete peace of mind."
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Flexible Access",
    description: "24/7 building access with secure keycard entry for maximum convenience."
  },
  {
    icon: <Headphones className="h-8 w-8" />,
    title: "Dedicated Support",
    description: "Professional property management team available to assist with all your needs."
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "High-Speed Internet",
    description: "Fiber optic internet connectivity with redundant backup systems."
  },
  {
    icon: <Car className="h-8 w-8" />,
    title: "Parking Solutions",
    description: "Covered parking spaces and visitor parking available for all tenants."
  },
  {
    icon: <Coffee className="h-8 w-8" />,
    title: "Amenities",
    description: "Modern break rooms, conference facilities, and professional common areas."
  }
];

const additionalFeatures = [
  { icon: <Wifi className="h-6 w-6" />, text: "Enterprise-grade WiFi" },
  { icon: <Camera className="h-6 w-6" />, text: "CCTV surveillance" },
  { icon: <Zap className="h-6 w-6" />, text: "Backup power systems" },
  { icon: <Car className="h-6 w-6" />, text: "Valet parking available" }
];

export default function Services() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Premium Services & Amenities
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            CTP RED CORP provides comprehensive services and amenities to ensure your business operates smoothly and efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-gray-200">
              <CardHeader>
                <div className="mx-auto text-primary mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-black">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features Section */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-black text-center mb-8">
            Additional Features Included
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg">
                <div className="text-primary">
                  {feature.icon}
                </div>
                <span className="text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-black text-white rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Find Your Perfect Office Space?
            </h3>
            <p className="text-gray-300 mb-6">
              Contact our CTP RED CORP team today to schedule a personalized tour of our available spaces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg transition-colors">
                Schedule a Tour
              </button>
              <button className="border border-white text-white hover:bg-white hover:text-black px-6 py-3 rounded-lg transition-colors">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}