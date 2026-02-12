import React from "react";
import { useState } from "react";
import CTPRED_LOGO from "../assets/CTPRED_LOGO.png";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

const navigationItems = {
  properties: [
    { label: "CTP Asean Tower", href: "#ctp-red-corp" },
    { label: "CTP Alpha Tower", href: "#ctp-alpha-tower" },
    { label: "CTP BF ", href: "#ctp-bf-building" },
  ],
  services: [
    {
      label: "Property Management",
      href: "#services-property-management",
    },
    {
      label: "Maintenance Services",
      href: "#services-maintenance",
    },
    { label: "Security Services", href: "#services-security" },
    { label: "IT Support", href: "#services-it-support" },
    {
      label: "Concierge Services",
      href: "#services-concierge",
    },
    { label: "Parking Services", href: "#services-parking" },
  ],
  tenants: [{ label: "Tenant Portal", href: "#tenant-portal" }],
  sustainability: [
    {
      label: "Board of Directors",
      href: "#sustainability-board-directors",
    },
    {
      label: "Management Team",
      href: "#sustainability-management-team",
    },
    {
      label: "Policies & Procedures",
      href: "#sustainability-policies",
    },
    {
      label: "Financial Reports",
      href: "#sustainability-financial-reports",
    },
    { label: "Compliance", href: "#sustainability-compliance" },
    {
      label: "Investor Relations",
      href: "#sustainability-investor-relations",
    },
  ],
  about: [
    { label: "Company History", href: "#about-history" },
    { label: "Our Team", href: "#about-team" },
    { label: "Mission & Vision", href: "#about-mission" },
    { label: "Core Values", href: "#about-values" },
    { label: "Awards & Recognition", href: "#about-awards" },
    { label: "Sustainability", href: "#about-sustainability" },
    { label: "Careers", href: "#about-careers" },
  ],
  contact: [
    {
      label: "General Inquiries",
      href: "#contact-general-inquiries",
    },
    { label: "Location Map", href: "#contact-location-map" },
    {
      label: "Business Hours",
      href: "#contact-business-hours",
    },
  ],
};

interface HoverDropdownProps {
  title: string;
  items: Array<{ label: string; href: string }>;
  dropdownTitle: string;
  fontSize?: string;
  isAbout?: boolean;
  isServices?: boolean;
  isContact?: boolean;
  isTenants?: boolean;
}

function HoverDropdown({
  title,
  items,
  dropdownTitle,
  fontSize = "text-[15px]",
  isAbout = false,
  isServices = false,
  isContact = false,
  isTenants = false,
}: HoverDropdownProps) {
  const handleTitleClick = () => {
    if (isAbout) {
      window.location.hash = "#about";
    } else if (isServices) {
      window.location.hash = "#services";
    } else if (isContact) {
      window.location.hash = "#contact";
    } else if (isTenants) {
      window.location.hash = "#tenant-portal";
    }
  };

  const handleItemClick = (href: string, e: React.MouseEvent) => {
    if (isAbout || isServices || isContact || isTenants) {
      e.preventDefault();
      window.location.hash = href;
    }
  };

  return (
    <div className="relative group">
      <div
        className={`flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors cursor-pointer ${fontSize}`}
        onClick={handleTitleClick}
      >
        <span>{title}</span>
        <ChevronDown className="h-4 w-4" />
      </div>

      {/* Dropdown Content */}
      <div className="absolute top-full left-0 mt-4 w-80 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-primary mb-1">
            {dropdownTitle}
          </h3>
          <div className="w-12 h-0.5 bg-primary"></div>
        </div>
        <div className="grid gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="py-3 px-4 text-base hover:bg-gray-100 hover:shadow-sm transition-all duration-200 rounded-md"
            >
              <a
                href={item.href}
                onClick={(e) => handleItemClick(item.href, e)}
                className="w-full text-gray-700 hover:text-primary text-[16px] block"
              >
                {item.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage = "home" }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Main navigation */}
      <div className="bg-white shadow-sm border-b h-16">
        <div className="mx-auto px-20 h-full max-w-[1126px] lg:max-w-[1126px] xl:max-w-[1408px] 2xl:max-w-[1689px]">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-6 h-full">
              <div className="h-full flex items-center mr-8">
                <button
                  onClick={() => {
                    window.location.hash = "";
                  }}
                  className="h-full flex items-center"
                >
                  <img
                    src={CTPRED_LOGO}
                    alt="CTP RED CORP"
                    className="h-[44px] w-auto object-contain"
                  />
                </button>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-10 p-[0px] mx-[0px] my-[10px]">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = "";
                }}
                className="text-gray-700 hover:text-primary transition-colors text-[15px] px-2 py-1"
              >
                Home
              </a>

              <HoverDropdown
                title="About"
                items={navigationItems.about}
                dropdownTitle="About CTP RED CORP"
                isAbout={true}
              />

              <HoverDropdown
                title="Properties"
                items={navigationItems.properties}
                dropdownTitle="Our Properties"
              />

              <HoverDropdown
                title="Services"
                items={navigationItems.services}
                dropdownTitle="Professional Services"
                isServices={true}
              />

              <a
                href="#tenant-portal"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = "#tenant-portal";
                }}
                className="text-gray-700 hover:text-primary transition-colors text-[15px] px-2 py-1"
              >
                Tenants
              </a>

              <HoverDropdown
                title="Sustainability"
                items={navigationItems.sustainability}
                dropdownTitle="Governance & Leadership"
              />

              <HoverDropdown
                title="Contact"
                items={navigationItems.contact}
                dropdownTitle="Get In Touch"
                isContact={true}
              />
            </nav>

            <Button
              className="bg-primary hover:bg-accent text-white ml-8"
              onClick={() => {
                window.location.hash = "#schedule-appointment";
              }}
            >
              <span className="px-4">Schedule Appointment</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
