import { Building, Wrench, Shield, Monitor, Users, Car, Clock, Phone, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export default function ServicesPage() {
  const services = [
    {
      icon: Building,
      title: "Property Management",
      description: "Comprehensive property management services ensuring optimal building performance and tenant satisfaction.",
      features: [
        "24/7 building operations monitoring",
        "Preventive maintenance programs",
        "Tenant relations management",
        "Financial reporting and budgeting",
        "Lease administration",
        "Space planning and optimization"
      ],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Wrench,
      title: "Maintenance Services",
      description: "Professional maintenance services to keep your workspace operating at peak efficiency.",
      features: [
        "HVAC system maintenance",
        "Electrical and plumbing services",
        "Elevator maintenance and repair",
        "Emergency repair services",
        "Preventive maintenance scheduling",
        "Energy efficiency optimization"
      ],
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Shield,
      title: "Security Services",
      description: "Advanced security solutions providing peace of mind for your business operations.",
      features: [
        "24/7 security monitoring",
        "Access control systems",
        "Surveillance camera networks",
        "Security guard services",
        "Emergency response protocols",
        "Visitor management systems"
      ],
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Monitor,
      title: "IT Support",
      description: "Comprehensive technology support to keep your business connected and productive.",
      features: [
        "High-speed internet connectivity",
        "Network infrastructure support",
        "Technical help desk services",
        "Audio/visual equipment support",
        "Cybersecurity solutions",
        "Cloud services integration"
      ],
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Users,
      title: "Concierge Services",
      description: "Premium concierge services designed to enhance your workplace experience.",
      features: [
        "Reception and guest services",
        "Package and mail handling",
        "Event planning assistance",
        "Restaurant reservations",
        "Transportation coordination",
        "Personal service requests"
      ],
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Car,
      title: "Parking Services",
      description: "Convenient and secure parking solutions for tenants and their guests.",
      features: [
        "Reserved parking spaces",
        "Visitor parking management",
        "Electric vehicle charging",
        "Security monitoring",
        "Monthly parking passes"
      ],
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const serviceStats = [
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "24/7", label: "Support Available" },
    { number: "200+", label: "Satisfied Clients" },
    { number: "15min", label: "Average Response Time" }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Professional <span className="text-primary">Services</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive solutions designed to support your business operations and 
            enhance your workplace experience at CTP RED CORP.
          </p>
        </div>

        {/* Service Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {serviceStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="space-y-20">
          {services.map((service, index) => (
            <div key={index} className={`grid md:grid-cols-2 gap-12 items-center ${
              index % 2 === 1 ? 'md:grid-flow-col-dense' : ''
            }`}>
              <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                <div className="flex items-center mb-4">
                  <service.icon className="h-10 w-10 text-primary mr-4" />
                  <h2 className="text-3xl font-bold text-gray-900">{service.title}</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">{service.description}</p>
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="bg-primary hover:bg-accent text-white">
                  Learn More
                </Button>
              </div>
              <div className={index % 2 === 1 ? 'md:col-start-1' : ''}>
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

        {/* Support Section */}
        <div className="mt-20">
          <div className="bg-gray-50 rounded-lg p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Need Immediate Assistance?
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our dedicated support team is available around the clock to address 
                  your needs and ensure smooth business operations.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-primary mr-3" />
                    <span className="text-gray-700">Emergency Hotline: (555) 123-HELP</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-primary mr-3" />
                    <span className="text-gray-700">Response Time: Within 15 minutes</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Service Request</h3>
                  <p className="text-gray-600 mb-6">
                    Submit a service request online and track its progress in real-time.
                  </p>
                  <Button className="bg-primary hover:bg-accent text-white w-full">
                    Submit Request
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-20 text-center">
          <div className="bg-black text-white rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience Excellence?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Discover how our comprehensive services can enhance your business operations 
              and create an exceptional workplace environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="bg-primary text-white hover:bg-accent">
                Schedule Consultation
              </Button>
              <Button variant="secondary" size="lg" className="bg-primary text-white hover:bg-accent">
                View Service Packages
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}