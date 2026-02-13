import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Wrench, 
  AlertTriangle, 
  Calendar,
  Shield,
  HeadphonesIcon,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export default function ContactPage() {
  // State for controlling which map is displayed
  const [selectedMap, setSelectedMap] = useState("ctp-asean"); // Default to CTP Asean

  // External map URLs for each building (kept in sync with Footer.tsx)
  const mapLinks: Record<string, string> = {
    "ctp-alpha": "https://maps.app.goo.gl/rzPgQHFY49L4UYpRA",
    "ctp-asean": "https://maps.app.goo.gl/3Qw6E7DdYSKUzcsj9",
    "ctp-bf": "https://maps.app.goo.gl/aGPvpMu35rYTxBAw7",
  };

  // Map embeds for each building
  const mapEmbeds = {
    "ctp-asean": {
      title: "CTP Asean Tower Map",
      embed: (
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.464218160311!2d121.0388812!3d14.419703300000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d034234ddbeb%3A0x11241dc397e340f6!2sCTP%20Asean%20Tower!5e1!3m2!1sen!2sph!4v1759297698722!5m2!1sen!2sph"
          width="600" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="CTP Asean Tower Map"
          className="w-full"
        />
      )
    },
    "ctp-alpha": {
      title: "CTP Alpha Tower Map",
      embed: (
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.3633589224305!2d121.0227141!3d14.4259494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d1cf7ae78ef9%3A0x262c1bcfed4c5e4d!2sCTP%20Alpha%20Tower!5e1!3m2!1sen!2sph!4v1759297655204!5m2!1sen!2sph"
          width="600" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="CTP Alpha Tower Map"
          className="w-full"
        />
      )
    },
    "ctp-bf": {
      title: "CTP BF Building Map",
      embed: (
        <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">CTP BF Building Map</h3>
            <p className="text-gray-500">
              Map embed will be available here
            </p>
          </div>
        </div>
      )
    }
  };

  // Function to handle Get Directions button clicks - only updates the map
  const handleGetDirections = (buildingKey: string) => {
    // Update the displayed map
    setSelectedMap(buildingKey);

    // Open external maps link in a new tab if available
    const url = mapLinks[buildingKey];
    if (url && typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our team",
      contact: "+63 2 8334 2091",
      hours: "Mon-Fri: 9AM-5PM",
      type: "primary"
    },
    {
      icon: Mail,
      title: "Email Support", 
      description: "Send us a message",
      contact: "info@ctpredcorp.com",
      hours: "Response within 24hrs",
      type: "primary"
    }
  ];

  const officeLocations = [
    {
      name: "CTP RED I Corp. CTP Alpha Tower",
      address: "Lot 7 Block 2 Investment Drive, Madrigal Business Park, Alabang, Muntinlupa 1780",
      phone: "(02) 8856-7758",
      email: "alpha@ctpredcorp.com", 
      //manager: "",
      features: ["Premium Leasing", "Executive Services", "Concierge"]
    },
    {
      name: "CTP RED II Corp. CTP BF Building",
      address: "No. 11 Presidents Avenue, BF Homes Paranaque",
      phone: "(02) 8856-7758 / 0939 927 8239",
      email: "bgc@ctpredcorp.com",
      //manager: "Jennifer Lee",
      features: ["BGC Operations", "Tenant Services", "Parking Management"]
    },
    {
      name: "CTP RED III Corp. CTP Asean Tower",
      address: "Block 3 Lot 3 Spectrum Filinvest, Alabang, Muntinlupa 1780",
      phone: "(02) 8334-2091",
      email: "asean@ctpredcorp.com",
      //manager: "Maria Santos",
      features: ["Main Office", "Leasing Center", "24/7 Security"]
    }
  ];

  const emergencyContacts = [
    {
      type: "Fire Emergency",
      number: "(555) 911-FIRE",
      description: "24/7 Fire department hotline",
      icon: AlertTriangle,
      priority: "critical"
    },
    {
      type: "Medical Emergency",
      number: "(555) 911-HEALTH",
      description: "Medical emergency response",
      icon: HeadphonesIcon,
      priority: "critical"
    },
    {
      type: "Security Emergency",
      number: "(555) 123-SECURITY",
      description: "Building security issues",
      icon: Shield,
      priority: "high"
    },
    {
      type: "Maintenance Emergency",
      number: "(555) 123-URGENT",
      description: "After-hours urgent repairs",
      icon: Wrench,
      priority: "medium"
    }
  ];

  const businessHours = [
    {
      location: "CTP Asean Tower",
      schedule: [
        { days: "Monday - Friday", hours: "9:00 AM - 5:00 PM" },
        { days: "Saturday", hours: "8:00 AM - 8:00 PM" },
        { days: "Sunday", hours: "10:00 AM - 6:00 PM" },
        { days: "Security", hours: "24/7 Available" }
      ]
    },
    {
      location: "CTP Alpha Tower", 
      schedule: [
        { days: "Monday - Friday", hours: "9:00 AM - 5:00 PM" },
        { days: "Saturday", hours: "7:00 AM - 9:00 PM" },
        { days: "Sunday", hours: "9:00 AM - 7:00 PM" },
        { days: "Security", hours: "24/7 Available" }
      ]
    },
    {
      location: "CTP BF Building",
      schedule: [
        { days: "Monday - Friday", hours: "9:00 AM - 5:00 PM" },
        { days: "Saturday", hours: "8:00 AM - 8:00 PM" },
        { days: "Sunday", hours: "10:00 AM - 6:00 PM" },
        { days: "Security", hours: "24/7 Available" }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in <span className="text-white">Touch</span>
            </h1>
            <p className="text-xl opacity-90 mb-8">
              We're here to help with all your office leasing needs. Contact our professional 
              team for personalized service and expert guidance.
            </p>
          </div>
        </div>
      </section>

{/* General Inquiries */}
<section id="general-inquiries" className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      
      {/* Left Segment - Intro Text */}
      <div className="text-center lg:text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          General Inquiries
        </h2>
        <p className="text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
          Get in touch with our team for any questions about our properties, 
          services, or leasing opportunities.
        </p>
      </div>

      {/* Right Segment - Contact Methods */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Methods</h3>
        {contactMethods.map((method, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-lg ${
                    method.type === "primary"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <method.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {method.title}
                  </h4>
                  <p className="text-gray-600 mb-2">{method.description}</p>
                  <p className="text-primary font-semibold mb-1">{method.contact}</p>
                  <p className="text-sm text-gray-500">{method.hours}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  </div>
</section>

      {/* Location Map */}
      <section id="location-map" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Locations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find us at these strategic locations across Metro Manila's 
              premier business districts.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Interactive Map */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Interactive Map - {mapEmbeds[selectedMap].title}
                </h3>
              </div>
              <div className="relative">
                {mapEmbeds[selectedMap].embed}
              </div>
            </div>

            {/* Location Details */}
            <div className="grid lg:grid-cols-3 gap-8">
  {officeLocations.map((location, index) => (
    <Card key={index} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span>{location.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
          <p className="text-gray-600">{location.address}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Transportation</h4>
          <div className="space-y-1 text-sm text-gray-600">
            {index === 0 && (
              <>
                <p>• MRT/LRT: Alabang Station (5 min drive)</p>
                <p>• Bus: Several routes to Alabang</p>
                <p>• Parking: On-site parking available</p>
              </>
            )}
            {index === 1 && (
              <>
                <p>• MRT: Makati Station (2 min walk)</p>
                <p>• Bus: Multiple CBD routes</p>
                <p>• Taxi/Grab: Easy pickup zone</p>
              </>
            )}
            {index === 2 && (
              <>
                <p>• BGC Bus: Multiple stops nearby</p>
                <p>• Taxi/Grab: Convenient access</p>
                <p>• Walking: Connected to BGC walkways</p>
              </>
            )}
          </div>
        </div>

        {/* Directions Button */}
        {index === 0 && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => handleGetDirections("ctp-asean")}
          >
            Get Directions
          </Button>
        )}

        {index === 1 && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => handleGetDirections("ctp-alpha")}
          >
            Get Directions
          </Button>
        )}

        {index === 2 && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => handleGetDirections("ctp-bf")}
          >
            Get Directions
          </Button>
        )}
      </CardContent>
    </Card>
  ))}
</div>

          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section id="business-hours" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Business Hours
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our buildings are accessible with extended hours to support your 
              business operations, with 24/7 security at all locations.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {businessHours.map((building, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>{building.location}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {building.schedule.map((schedule, scheduleIndex) => (
                        <div 
                          key={scheduleIndex} 
                          className={`flex justify-between items-center p-3 rounded-lg ${
                            schedule.days === 'Security' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                          }`}
                        >
                          <span className={`font-medium ${
                            schedule.days === 'Security' ? 'text-green-700' : 'text-gray-700'
                          }`}>
                            {schedule.days}
                          </span>
                          <span className={`font-semibold ${
                            schedule.days === 'Security' ? 'text-green-600' : 'text-gray-900'
                          }`}>
                            {schedule.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Services */}
            <div className="mt-12 bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Additional Services Available
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Round-the-clock assistance" },
                  { icon: Shield, title: "Security", desc: "Professional security staff" },
                  { icon: Calendar, title: "After Hours Access", desc: "Advance arrangement required" }
                ].map((service, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
                      <service.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900 text-sm">{service.title}</h4>
                    </div>
                    <p className="text-xs text-gray-600">{service.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}