import React from "react";
import { useState } from "react";
import CTPRED_LOGO from "../assets/CTPRED_LOGO.png";
import { ChevronDown, Menu, X } from "lucide-react";
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
    // { label: "Our Team", href: "#about-team" },
    { label: "Mission & Vision", href: "#about-mission" },
    { label: "Core Values", href: "#about-values" },
    // { label: "Awards & Recognition", href: "#about-awards" },
    { label: "Sustainability", href: "#about-sustainability" },
    // { label: "Careers", href: "#about-careers" },
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
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = href;
    setIsOpen(false);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        className={`flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors cursor-pointer ${fontSize} px-2 py-1`}
      >
        <span>{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown Content with padding bridge */}
      {isOpen && (
        <div className="absolute top-full left-0 pt-2">
          <div 
            className="w-80 bg-white rounded-lg shadow-xl border transition-all duration-300 ease-in-out transform origin-top z-50 animate-dropdownIn"
          >
            <div className="p-6">
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
                    className="py-3 px-4 text-base hover:bg-gray-100 hover:shadow-sm transition-all duration-200 rounded-md cursor-pointer animate-slideIn"
                    style={{
                      animationDelay: `${index * 0.05}s`
                    }}
                    onClick={(e) => handleItemClick(item.href, e)}
                  >
                    <span className="w-full text-gray-700 hover:text-primary text-[16px] block">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-dropdownIn {
          animation: dropdownIn 0.2s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out both;
        }
      `}</style>
    </div>
  );
}

interface MobileAccordionProps {
  title: string;
  items: Array<{ label: string; href: string }>;
  isAbout?: boolean;
  isServices?: boolean;
  isContact?: boolean;
  onItemClick: () => void;
}

function MobileAccordion({
  title,
  items,
  isAbout = false,
  isServices = false,
  isContact = false,
  onItemClick,
}: MobileAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTitleClick = () => {
    // Only toggle accordion, don't navigate
    setIsOpen(!isOpen);
  };

  const handleItemClick = (href: string) => {
    window.location.hash = href;
    onItemClick();
  };

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex items-center justify-between w-full py-4 px-4 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        onClick={handleTitleClick}
      >
        <span className="font-medium text-lg">{title}</span>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="bg-gray-50 animate-accordionOpen">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleItemClick(item.href);
              }}
              className="block py-3 px-8 text-gray-600 hover:text-primary hover:bg-gray-100 transition-all duration-200 animate-fadeInUp"
              style={{
                animationDelay: `${index * 0.05}s`
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
      <style>{`
        @keyframes accordionOpen {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-accordionOpen {
          animation: accordionOpen 0.3s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out both;
        }
      `}</style>
    </div>
  );
}

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage = "home" }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Main navigation */}
      <div className="bg-white shadow-sm border-b h-16">
        <div className="mx-auto px-4 md:px-20 h-full max-w-[1126px] lg:max-w-[1126px] xl:max-w-[1408px] 2xl:max-w-[1689px]">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-6 h-full">
              <div className="h-full flex items-center">
                <button
                  onClick={() => {
                    window.location.hash = "";
                    closeMobileMenu();
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

            {/* Desktop Navigation - Show on md and above */}
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
                title="Contact"
                items={navigationItems.contact}
                dropdownTitle="Get In Touch"
                isContact={true}
              />
            </nav>

            {/* Desktop CTA Button - Show on md and above */}
            <Button
              className="hidden md:block bg-primary hover:bg-accent text-white ml-8 cursor-pointer transition-all duration-200"
              onClick={() => {
                window.location.hash = "#schedule-appointment";
              }}
            >
              <span className="px-4">Schedule Appointment</span>
            </Button>

            {/* Mobile Menu Button - Show only on mobile and tablet */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Show only on mobile and tablet */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white shadow-lg overflow-y-auto z-40 animate-mobileMenuSlide">
          <div className="py-4">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "";
                closeMobileMenu();
              }}
              className="block py-4 px-4 text-gray-700 hover:bg-gray-50 font-medium text-lg border-b border-gray-200 transition-colors duration-200"
            >
              Home
            </a>

            <MobileAccordion
              title="About"
              items={navigationItems.about}
              isAbout={true}
              onItemClick={closeMobileMenu}
            />

            <MobileAccordion
              title="Properties"
              items={navigationItems.properties}
              onItemClick={closeMobileMenu}
            />

            <MobileAccordion
              title="Services"
              items={navigationItems.services}
              isServices={true}
              onItemClick={closeMobileMenu}
            />

            <a
              href="#tenant-portal"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "#tenant-portal";
                closeMobileMenu();
              }}
              className="block py-4 px-4 text-gray-700 hover:bg-gray-50 font-medium text-lg border-b border-gray-200 transition-colors duration-200"
            >
              Tenants
            </a>

            <MobileAccordion
              title="Contact"
              items={navigationItems.contact}
              isContact={true}
              onItemClick={closeMobileMenu}
            />

            <div className="p-4 mt-4">
              <Button
                className="w-full bg-primary hover:bg-accent text-white cursor-pointer transition-all duration-200"
                onClick={() => {
                  window.location.hash = "#schedule-appointment";
                  closeMobileMenu();
                }}
              >
                <span className="px-4">Schedule Appointment</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes mobileMenuSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-mobileMenuSlide {
          animation: mobileMenuSlide 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}
