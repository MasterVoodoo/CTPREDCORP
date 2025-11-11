import {
  Building,
  Wrench,
  Shield,
  Monitor,
  Users,
  Car,
  Clock,
  Phone,
  CheckCircle,
  Zap,
  Coffee,
  Wifi,
  Camera,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export default function ServicesPageCombined() {
  const mainServices = [
    {
      id: "property-management",
      icon: Building,
      title: "Property Management",
      description:
        "Comprehensive property management services ensuring optimal building performance and tenant satisfaction.",
      features: [
        "24/7 building operations monitoring",
        "Preventive maintenance programs",
        "Tenant relations management",
        "Financial reporting and budgeting",
        "Lease administration",
        "Space planning and optimization",
      ],
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "maintenance",
      icon: Wrench,
      title: "Maintenance Services",
      description:
        "Professional maintenance services to keep your workspace operating at peak efficiency.",
      features: [
        "HVAC system maintenance",
        "Electrical and plumbing services",
        "Elevator maintenance and repair",
        "Emergency repair services",
        "Preventive maintenance scheduling",
        "Energy efficiency optimization",
      ],
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "security",
      icon: Shield,
      title: "Security Services",
      description:
        "Advanced security solutions providing peace of mind for your business operations.",
      features: [
        "24/7 security monitoring",
        "Access control systems",
        "Surveillance camera networks",
        "Security guard services",
        "Emergency response protocols",
        "Visitor management systems",
      ],
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "it-support",
      icon: Monitor,
      title: "IT Support",
      description:
        "Comprehensive technology support to keep your business connected and productive.",
      features: [
        "High-speed internet connectivity",
        "Network infrastructure support",
        "Technical help desk services",
        "Audio/visual equipment support",
        "Cybersecurity solutions",
        "Cloud services integration",
      ],
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "concierge",
      icon: Users,
      title: "Concierge Services",
      description:
        "Premium concierge services designed to enhance your workplace experience.",
      features: [
        "Reception and guest services",
        "Package and mail handling",
        "Event planning assistance",
        "Restaurant reservations",
        "Transportation coordination",
        "Personal service requests",
      ],
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "parking",
      icon: Car,
      title: "Parking Services",
      description:
        "Convenient and secure parking solutions for tenants and their guests.",
      features: [
        "Reserved parking spaces",
        "Visitor parking management",
        "Valet parking services",
        "Electric vehicle charging",
        "Security monitoring",
        "Monthly parking passes",
      ],
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  const premiumServices = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "24/7 Security",
      description:
        "Round-the-clock security monitoring and access control for complete peace of mind.",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Flexible Access",
      description:
        "24/7 building access with secure keycard entry for maximum convenience.",
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Dedicated Support",
      description:
        "Professional property management team available to assist with all your needs.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "High-Speed Internet",
      description:
        "Fiber optic internet connectivity with redundant backup systems.",
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: "Parking Solutions",
      description:
        "Covered parking spaces and visitor parking available for all tenants.",
    },
    {
      icon: <Coffee className="h-8 w-8" />,
      title: "Amenities",
      description:
        "Modern break rooms, conference facilities, and professional common areas.",
    },
  ];

  const additionalFeatures = [
    {
      icon: <Wifi className="h-6 w-6" />,
      text: "Enterprise-grade WiFi",
    },
    {
      icon: <Camera className="h-6 w-6" />,
      text: "CCTV surveillance",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      text: "Backup power systems",
    },
    {
      icon: <Car className="h-6 w-6" />,
      text: "Valet parking available",
    },
  ];

  const serviceStats = [
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "24/7", label: "Support Available" },
    { number: "200+", label: "Satisfied Clients" },
    { number: "15min", label: "Average Response Time" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Professional{" "}
              <span className="text-white">Services</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Comprehensive solutions designed to support your
              business operations and enhance your workplace
              experience at CTP RED CORP.
            </p>
          </div>
        </div>
      </section>

      {/* Service Stats */}
      <section className="py-20 bg-white mx-[0px] my-[10px] mx-[0px] m-[0px] p-[0px]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {serviceStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Services Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Premium Services & Amenities
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              CTP RED CORP provides comprehensive services and
              amenities to ensure your business operates
              smoothly and efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {premiumServices.map((service, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow border-gray-200"
              >
                <CardHeader>
                  <div className="mx-auto text-primary mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-black">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Features */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-black text-center mb-8">
              Additional Features Included
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg"
                >
                  <div className="text-primary">
                    {feature.icon}
                  </div>
                  <span className="text-gray-700">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Service Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Detailed overview of our professional services
              designed to support and enhance your business
              operations.
            </p>
          </div>

          <div className="space-y-20">
            {mainServices.map((service, index) => (
              <div
                key={index}
                id={service.id}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1
                    ? "md:grid-flow-col-dense"
                    : ""
                }`}
              >
                <div
                  className={
                    index % 2 === 1 ? "md:col-start-2" : ""
                  }
                >
                  <div className="flex items-center mb-4">
                    <service.icon className="h-10 w-10 text-primary mr-4" />
                    <h3 className="text-3xl font-bold text-gray-900">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    {service.description}
                  </p>
                  <div className="space-y-3 mb-8">
                    {service.features.map(
                      (feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center"
                        >
                          <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                          <span className="text-gray-700">
                            {feature}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
                <div
                  className={
                    index % 2 === 1 ? "md:col-start-1" : ""
                  }
                >
                  <div className="relative">
                    <ImageWithFallback
                      src={service.image}
                      alt={service.title}
                      className="rounded-lg shadow-lg w-full h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}