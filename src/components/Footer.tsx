import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import { Separator } from "./ui/separator";
//import ctpLogo from "figma:asset/8ed115b5c30a60d213ba162e5cfc8f35f079d16b.png";

const buildings = [
  {
    name: "CTP Alpha Tower",
    address: "1709 Investment Dr, Muntinlupa",
    phone: "+1 (555) 123-4567",
    map: "https://maps.app.goo.gl/rzPgQHFY49L4UYpRA",
  },
  {
    name: "CTP Corporate Center",
    address: "Asean Drive, Alabang, Muntinlupa",
    phone: "+1 (555) 234-5678",
    map: "https://maps.app.goo.gl/3Qw6E7DdYSKUzcsj9",
  },
  {
    name: "CTP BF Building",
    address: "11 President's Ave, Parañaque, Metro Manila",
    phone: "+1 (555) 345-6789",
    map: "https://maps.app.goo.gl/aGPvpMu35rYTxBAw7",
  },
];

const quickLinks = [
  "Available Spaces",
  "Building Amenities",
  "Lease Terms",
  "Parking Information",
  "Building Services",
  "Contact Us",
  "Admin Portal",
];

const services = [
  "Office Space Leasing",
  "Property Management",
  "Maintenance Services",
  "Security Services",
  "IT Support",
  "Concierge Services",
];

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Building Locations */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-primary mb-6 text-center">
            Our Building Locations
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {buildings.map((building, index) => (
              <div
                key={index}
                className="bg-gray-900 p-4 rounded-lg"
              >
                <h4 className="font-bold text-white mb-2">
                  {building.name}
                </h4>
                <div className="flex items-start space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary mt-1" />
                  <a href={building.map} target="_blank" rel="noopener noreferrer">
                  <p className="text-gray-300 text-sm">
                    {building.address}
                  </p>
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <p className="text-gray-300 text-sm">
                    {building.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="mb-8 bg-gray-700" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 CTP RED CORP. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}