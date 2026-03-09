import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CTPRED_LOGO from "@/assets/CTPRED_LOGO.png";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = {
  properties: [
    { label: "CTP Asean Tower", to: "/properties/ctp-asean-tower" },
    { label: "CTP Alpha Tower", to: "/properties/ctp-alpha-tower" },
    { label: "CTP BF", to: "/properties/ctp-bf-building" },
  ],
  services: [
    { label: "Property Management", to: "/services#property-management" },
    { label: "Maintenance Services", to: "/services#maintenance" },
    { label: "Security Services", to: "/services#security" },
    { label: "IT Support", to: "/services#it-support" },
    { label: "Concierge Services", to: "/services#concierge" },
    { label: "Parking Services", to: "/services#parking" },
  ],
  sustainability: [
    { label: "Board of Directors", to: "/sustainability/board-of-directors" },
    { label: "Management Team", to: "/sustainability/management-team" },
    { label: "Policies & Procedures", to: "/sustainability/policies" },
    { label: "Compliance", to: "/sustainability/compliance" },
    { label: "Investor Relations", to: "/sustainability/investor-relations" },
  ],
  about: [
    { label: "Company History", to: "/about#history" },
    { label: "Mission & Vision", to: "/about#mission" },
    { label: "Core Values", to: "/about#values" },
    { label: "Sustainability", to: "/about#sustainability" },
  ],
  contact: [
    { label: "General Inquiries", to: "/contact#general-inquiries" },
    { label: "Location Map", to: "/contact#location-map" },
    { label: "Business Hours", to: "/contact#business-hours" },
  ],
};

interface HoverDropdownProps {
  title: string;
  items: Array<{ label: string; to: string }>;
  dropdownTitle: string;
  fontSize?: string;
}

function HoverDropdown({
  title,
  items,
  dropdownTitle,
  fontSize = "text-[15px]",
}: HoverDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleItemClick = (to: string) => {
    navigate(to);
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
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 pt-2">
          <div className="w-80 bg-white rounded-lg shadow-xl border transition-all duration-300 ease-in-out transform origin-top z-50 animate-dropdownIn">
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
                      animationDelay: `${index * 0.05}s`,
                    }}
                    onClick={() => handleItemClick(item.to)}
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
  items: Array<{ label: string; to: string }>;
  onItemClick: () => void;
}

function MobileAccordion({
  title,
  items,
  onItemClick,
}: MobileAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleItemClick = (to: string) => {
    navigate(to);
    onItemClick();
  };

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex items-center justify-between w-full py-4 px-4 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-lg">{title}</span>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="bg-gray-50 animate-accordionOpen">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => handleItemClick(item.to)}
              className="block py-3 px-8 text-gray-600 hover:text-primary hover:bg-gray-100 transition-all duration-200 animate-fadeInUp cursor-pointer"
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
            >
              {item.label}
            </div>
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

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="bg-white shadow-sm border-b h-16">
        <div className="mx-auto px-4 md:px-20 h-full max-w-[1126px] lg:max-w-[1126px] xl:max-w-[1408px] 2xl:max-w-[1689px]">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-6 h-full">
              <div className="h-full flex items-center">
                <Link to="/" className="h-full flex items-center">
                  <img
                    src={CTPRED_LOGO}
                    alt="CTP RED CORP"
                    className="h-[44px] w-auto object-contain"
                  />
                </Link>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-10 p-[0px] mx-[0px] my-[10px]">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary transition-colors text-[15px] px-2 py-1"
              >
                Home
              </Link>

              <HoverDropdown
                title="About"
                items={navigationItems.about}
                dropdownTitle="About CTP RED CORP"
              />

              <HoverDropdown
                title="Properties"
                items={navigationItems.properties}
                dropdownTitle="Our Properties"
              />

              <Link
                to="/tenant-portal"
                className="text-gray-700 hover:text-primary transition-colors text-[15px] px-2 py-1"
              >
                Tenants
              </Link>

              <HoverDropdown
                title="Contact"
                items={navigationItems.contact}
                dropdownTitle="Get In Touch"
              />
            </nav>

            <Button
              className="hidden md:block bg-primary hover:bg-accent text-white ml-8 cursor-pointer transition-all duration-200"
              onClick={() => navigate("/schedule")}
            >
              <span className="px-4">Schedule Appointment</span>
            </Button>

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

      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white shadow-lg overflow-y-auto z-40 animate-mobileMenuSlide">
          <div className="py-4">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block py-4 px-4 text-gray-700 hover:bg-gray-50 font-medium text-lg border-b border-gray-200 transition-colors duration-200"
            >
              Home
            </Link>

            <MobileAccordion
              title="About"
              items={navigationItems.about}
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
              onItemClick={closeMobileMenu}
            />

            <Link
              to="/tenant-portal"
              onClick={closeMobileMenu}
              className="block py-4 px-4 text-gray-700 hover:bg-gray-50 font-medium text-lg border-b border-gray-200 transition-colors duration-200"
            >
              Tenants
            </Link>

            <MobileAccordion
              title="Contact"
              items={navigationItems.contact}
              onItemClick={closeMobileMenu}
            />

            <div className="p-4 mt-4">
              <Button
                className="w-full bg-primary hover:bg-accent text-white cursor-pointer transition-all duration-200"
                onClick={() => {
                  navigate("/schedule");
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
