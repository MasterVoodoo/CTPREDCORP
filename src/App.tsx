import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturedListings from "./components/FeaturedListings";
import About from "./components/About";
import Statistics from "./components/Statistics";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import DynamicBuildingProperty from "./components/DynamicBuildingProperty";
import CtpRedCorpProperty from "./components/CtpRedCorpProperty";
import CtpAlphaTowerProperty from "./components/CtpAlphaTowerProperty";
import CtpBfBuildingProperty from "./components/CtpBfBuildingProperty";
import ScheduleAppointment from "./components/ScheduleAppointment";
import ServicesPageCombined from "./components/ServicesPageCombined";
import ContactPage from "./components/ContactPage";
import UnitDetailsPage from "./components/UnitDetailsPage";
import SearchResults from "./components/SearchResults";
import AllAvailableSpaces from "./components/AllAvailableSpaces";
import PropertiesPage from "./components/PropertiesPage";
import TenantsPortal from "./components/TenantsPortal";
import SustainabilityPlaceholder from "./components/SustainabilityPlaceholder";
import BoardOfDirectors from "./components/BoardOfDirectors";
import ManagementTeam from "./components/ManagementTeam";
import ModernManagementTeam from "./components/ModernManagementTeam";
import PoliciesProcedures from "./components/PoliciesProcedures";
import Compliance from "./components/Compliance";
import InvestorRelations from "./components/InvestorRelations";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string>("home");
  const [searchParams, setSearchParams] = useState<{
    buildingId: string;
    floor: number;
  } | null>(null);
  const [allSpacesFilters, setAllSpacesFilters] = useState<{
    building: string;
    condition: string;
  } | null>(null);

  // List of known building pages (hardcoded legacy pages)
  const knownBuildingPages = ['ctp-red-corp', 'ctp-alpha-tower', 'ctp-bf-building'];

  // Handle navigation from external links (like from navigation dropdown)
  useEffect(() => {
    const handleHashAndPathChange = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      const prevPage = currentPage; // Store current page before changing it
      
      if (hash === "#ctp-red-corp") {
        setPreviousPage(prevPage);
        setCurrentPage("ctp-red-corp");
      } else if (hash === "#ctp-alpha-tower") {
        setPreviousPage(prevPage);
        setCurrentPage("ctp-alpha-tower");
      } else if (hash === "#ctp-bf-building") {
        setPreviousPage(prevPage);
        setCurrentPage("ctp-bf-building");
      } else if (
        hash === "#about" ||
        hash.startsWith("#about-")
      ) {
        setPreviousPage(prevPage);
        setCurrentPage("about");

        // Handle section scrolling for about page sections
        if (hash.startsWith("#about-")) {
          const sectionId = hash.replace("#about-", "");
          setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
              element.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 100);
        }
      } else if (hash === "#schedule-appointment") {
        setPreviousPage(prevPage);
        setCurrentPage("schedule-appointment");
      } else if (hash === "#all-available-spaces" || hash.startsWith("#all-available-spaces?")) {
        setPreviousPage(prevPage);
        
        // Parse query parameters from the hash
        if (hash.includes('?')) {
          const queryString = hash.split('?')[1];
          const urlParams = new URLSearchParams(queryString);
          const building = urlParams.get('building') || '';
          const condition = urlParams.get('condition') || '';
          setAllSpacesFilters({ building, condition });
        } else {
          setAllSpacesFilters(null);
        }
        
        setCurrentPage("all-available-spaces");
      } else if (hash === "#properties") {
        setPreviousPage(prevPage);
        setCurrentPage("properties");
      } else if (hash === "#tenant-portal" || hash.startsWith("#tenant-")) {
        setPreviousPage(prevPage);
        setCurrentPage("tenant-portal");
      } else if (hash === "#modern-management-team") {
        setPreviousPage(prevPage);
        setCurrentPage("modern-management-team");
      } else if (hash.startsWith("#sustainability-")) {
        setPreviousPage(prevPage);
        setCurrentPage(hash.substring(1)); // Remove the # and use the full hash as page name
      } else if (hash === "#services" || hash.startsWith("#services-")) {
        setPreviousPage(prevPage);
        setCurrentPage("services");
        
        // Handle section scrolling for services page sections
        if (hash.startsWith("#services-")) {
          const sectionId = hash.replace("#services-", "");
          setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 100);
        }
      } else if (hash === "#contact" || hash.startsWith("#contact-")) {
        setPreviousPage(prevPage);
        setCurrentPage("contact");
        
        // Handle section scrolling for contact page sections
        if (hash.startsWith("#contact-")) {
          const sectionId = hash.replace("#contact-", "");
          setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 100);
        }
      } else if (hash.startsWith("#unit-")) {
        const unitId = hash.replace("#unit-", "");
        setPreviousPage(prevPage);
        setSelectedUnitId(unitId);
        setCurrentPage("unit-details");
      } else if (hash.startsWith("#search-")) {
        // Handle search results - format: #search-buildingId-floor
        const searchParts = hash.replace("#search-", "").split("-");
        if (searchParts.length >= 2) {
          const buildingId = searchParts.slice(0, -1).join("-"); // Rejoin in case building ID contains hyphens
          const floor = parseInt(searchParts[searchParts.length - 1]);
          if (!isNaN(floor)) {
            setPreviousPage(prevPage);
            setSearchParams({ buildingId, floor });
            setCurrentPage("search-results");
          }
        }
      } else if (hash && hash !== "#") {
        // Check if it's a building page (any hash that starts with # and isn't a known route)
        const pageId = hash.substring(1); // Remove the #
        
        // List of known non-building routes
        const knownRoutes = [
          'about', 'services', 'contact', 'schedule-appointment', 
          'all-available-spaces', 'properties', 'tenant-portal',
          'modern-management-team', 'home'
        ];
        
        const isKnownRoute = knownRoutes.some(route => pageId === route || pageId.startsWith(route + '-'));
        const isUnitRoute = pageId.startsWith('unit-');
        const isSearchRoute = pageId.startsWith('search-');
        const isSustainabilityRoute = pageId.startsWith('sustainability-');
        
        // If it's not a known route, assume it's a building page
        if (!isKnownRoute && !isUnitRoute && !isSearchRoute && !isSustainabilityRoute) {
          setPreviousPage(prevPage);
          setCurrentPage(pageId);
        } else {
          setPreviousPage(prevPage);
          setCurrentPage("home");
        }
      } else {
        setPreviousPage(prevPage);
        setCurrentPage("home");
      }
    };

    // Listen for hash changes and popstate (for pathname changes)
    window.addEventListener("hashchange", handleHashAndPathChange);
    window.addEventListener("popstate", handleHashAndPathChange);

    // Check initial hash and pathname
    handleHashAndPathChange();

    return () => {
      window.removeEventListener("hashchange", handleHashAndPathChange);
      window.removeEventListener("popstate", handleHashAndPathChange);
    };
  }, [currentPage]);

  const goToHome = () => {
    setPreviousPage(currentPage);
    setCurrentPage("home");
    window.location.hash = "";
  };

  const goToAbout = () => {
    setPreviousPage(currentPage);
    setCurrentPage("about");
    window.location.hash = "#about";
  };

  const goToScheduleAppointment = () => {
    setPreviousPage(currentPage);
    setCurrentPage("schedule-appointment");
    window.location.hash = "#schedule-appointment";
  };

  const goToAllAvailableSpaces = () => {
    setPreviousPage(currentPage);
    setAllSpacesFilters(null); // Clear any existing filters when navigating normally
    setCurrentPage("all-available-spaces");
    window.location.hash = "#all-available-spaces";
  };

  const goToProperties = () => {
    setPreviousPage(currentPage);
    setCurrentPage("properties");
    window.location.hash = "#properties";
  };

  const goToServices = () => {
    setPreviousPage(currentPage);
    setCurrentPage("services");
    window.location.hash = "#services";
  };

  const goToContact = () => {
    setPreviousPage(currentPage);
    setCurrentPage("contact");
    window.location.hash = "#contact";
  };

  const goToTenantPortal = () => {
    setPreviousPage(currentPage);
    setCurrentPage("tenant-portal");
    window.location.hash = "#tenant-portal";
  };

  const goToModernManagementTeam = () => {
    setPreviousPage(currentPage);
    setCurrentPage("modern-management-team");
    window.location.hash = "#modern-management-team";
  };

  const goToUnitDetails = (unitId: string) => {
    // Track where we're coming from
    setPreviousPage(currentPage);
    setSelectedUnitId(unitId);
    setCurrentPage("unit-details");
    window.location.hash = `#unit-${unitId}`;
  };

  // Function to determine the correct back destination based on unit ID
  const getBackDestinationFromUnit = (unitId: string) => {
    // If we came from search results, go back to search results
    if (previousPage === "search-results" && searchParams) {
      return "search-results";
    }
    
    if (unitId.startsWith("CRC-")) {
      return "ctp-red-corp";
    } else if (unitId.startsWith("CAT-")) {
      return "ctp-alpha-tower";
    } else if (unitId.startsWith("CBF-")) {
      return "ctp-bf-building";
    } else if (unitId.startsWith("featured-")) {
      return "home";
    } else {
      // Default fallback to previous page
      return previousPage;
    }
  };

  const goBackFromUnitDetails = () => {
    if (selectedUnitId) {
      const backDestination = getBackDestinationFromUnit(selectedUnitId);
      
      switch (backDestination) {
        case "ctp-red-corp":
          goToCtpRedCorp();
          break;
        case "ctp-alpha-tower":
          goToCtpAlphaTower();
          break;
        case "ctp-bf-building":
          goToCtpBfBuilding();
          break;
        case "search-results":
          if (searchParams) {
            setCurrentPage("search-results");
            window.location.hash = `#search-${searchParams.buildingId}-${searchParams.floor}`;
          } else {
            goToHome();
          }
          break;
        case "home":
        default:
          goToHome();
          break;
      }
    } else {
      goToHome();
    }
  };

  // Simple back function that uses the previousPage state
  const goBack = () => {
    const backTo = previousPage;
    
    switch (backTo) {
      case "ctp-red-corp":
        goToCtpRedCorp();
        break;
      case "ctp-alpha-tower":
        goToCtpAlphaTower();
        break;
      case "ctp-bf-building":
        goToCtpBfBuilding();
        break;
      case "search-results":
        if (searchParams) {
          setCurrentPage("search-results");
          window.location.hash = `#search-${searchParams.buildingId}-${searchParams.floor}`;
        } else {
          goToHome();
        }
        break;
      case "about":
        goToAbout();
        break;
      case "services":
        goToServices();
        break;
      case "contact":
        goToContact();
        break;
      case "schedule-appointment":
        goToScheduleAppointment();
        break;
      case "all-available-spaces":
        // Preserve any existing filters when going back
        setCurrentPage("all-available-spaces");
        window.location.hash = "#all-available-spaces";
        break;
      case "properties":
        goToProperties();
        break;
      case "tenant-portal":
        goToTenantPortal();
        break;
      case "modern-management-team":
        goToModernManagementTeam();
        break;
      case "sustainability-board-directors":
      case "sustainability-management-team":
      case "sustainability-policies":
      case "sustainability-compliance":
      case "sustainability-investor-relations":
        setCurrentPage(backTo);
        window.location.hash = `#${backTo}`;
        break;
      case "home":
      default:
        goToHome();
        break;
    }
  };

  const goBackFromSearch = () => {
    setPreviousPage(currentPage);
    setCurrentPage("home");
    window.location.hash = "";
  };

  const goToCtpRedCorp = () => {
    setPreviousPage(currentPage);
    setCurrentPage("ctp-red-corp");
    window.location.hash = "#ctp-red-corp";
  };

  const goToCtpAlphaTower = () => {
    setPreviousPage(currentPage);
    setCurrentPage("ctp-alpha-tower");
    window.location.hash = "#ctp-alpha-tower";
  };

  const goToCtpBfBuilding = () => {
    setPreviousPage(currentPage);
    setCurrentPage("ctp-bf-building");
    window.location.hash = "#ctp-bf-building";
  };

  const handleSearch = (buildingId: string, floor: number) => {
    setPreviousPage(currentPage);
    setSearchParams({ buildingId, floor });
    setCurrentPage("search-results");
    window.location.hash = `#search-${buildingId}-${floor}`;
  };

  const handleOfficeSearch = (building: string, condition: string) => {
    setPreviousPage(currentPage);
    setAllSpacesFilters({ building, condition });
    setCurrentPage("all-available-spaces");
    
    // Create query params for the URL
    const params = new URLSearchParams();
    if (building) params.set('building', building);
    if (condition) params.set('condition', condition);
    
    const queryString = params.toString();
    window.location.hash = queryString ? `#all-available-spaces?${queryString}` : "#all-available-spaces";
  };

  // UPDATED: Dynamic building navigation - works with ANY building ID from database
  const handleBuildingNavigation = (buildingId: string) => {
    setPreviousPage(currentPage);
    
    // Use the building ID directly as the page name and hash
    setCurrentPage(buildingId);
    window.location.hash = `#${buildingId}`;
  };

  // Check if current page is a building page (not in known special routes)
  const isBuildingPage = () => {
    const specialPages = [
      'home', 'about', 'services', 'contact', 'schedule-appointment',
      'all-available-spaces', 'properties', 'tenant-portal', 'unit-details',
      'search-results', 'modern-management-team',
      'sustainability-board-directors', 'sustainability-management-team',
      'sustainability-policies', 'sustainability-compliance',
      'sustainability-investor-relations'
    ];
    
    return !specialPages.includes(currentPage) && currentPage !== 'home';
  };

  // If it's a building page (dynamic or legacy), render the appropriate component
  if (isBuildingPage()) {
    // Check if it's one of the legacy hardcoded building pages
    if (currentPage === "ctp-red-corp") {
      return (
        <div className="min-h-screen">
          <Header currentPage="ctp-red-corp" />
          <div className="pt-16">
            <CtpRedCorpProperty onBack={goToHome} onViewDetails={goToUnitDetails} />
            <Footer />
          </div>
          <ScrollToTop />
        </div>
      );
    }

    if (currentPage === "ctp-alpha-tower") {
      return (
        <div className="min-h-screen">
          <Header currentPage="ctp-alpha-tower" />
          <div className="pt-16">
            <CtpAlphaTowerProperty onBack={goToHome} onViewDetails={goToUnitDetails} />
            <Footer />
          </div>
          <ScrollToTop />
        </div>
      );
    }

    if (currentPage === "ctp-bf-building") {
      return (
        <div className="min-h-screen">
          <Header currentPage="ctp-bf-building" />
          <div className="pt-16">
            <CtpBfBuildingProperty onBack={goToHome} onViewDetails={goToUnitDetails} />
            <Footer />
          </div>
          <ScrollToTop />
        </div>
      );
    }

    // For any other building page, use DynamicBuildingProperty
    return (
      <div className="min-h-screen">
        <Header currentPage={currentPage} />
        <div className="pt-16">
          <DynamicBuildingProperty 
            buildingId={currentPage} 
            onBack={goToHome} 
            onViewDetails={goToUnitDetails} 
          />
          <Footer />
        </div>
        <ScrollToTop />
      </div>
    );
  }

  if (currentPage === "about") {
    return (
      <div className="min-h-screen">
        <Header currentPage="about" />
        <div className="pt-16">
          <About />
          <Footer />
        </div>
        <ScrollToTop />
      </div>
    );
  }

  if (currentPage === "schedule-appointment") {
    return (
      <div className="min-h-screen">
        <Header currentPage="schedule-appointment" />
        <div className="pt-16">
          <ScheduleAppointment />
          <Footer />
        </div>
        <ScrollToTop />
      </div>
    );
  }

  if (currentPage === "services") {
    return (
      <div className="min-h-screen">
        <Header currentPage="services" />
        <div className="pt-16">
          <ServicesPageCombined />
          <Footer />
        </div>
        <ScrollToTop />
      </div>
    );
  }

  if (currentPage === "contact") {
    return (
      <div className="min-h-screen">
        <Header currentPage="contact" />
        <div className="pt-16">
          <ContactPage />
          <Footer />
        </div>
        <ScrollToTop />
      </div>
    );
  }

  if (currentPage === "unit-details" && selectedUnitId) {
    return (
      <div className="min-h-screen">
        <Header currentPage="unit-details" />
        <div className="pt-16">
          <UnitDetailsPage 
            unitId={selectedUnitId} 
            onBack={goBackFromUnitDetails}
            onScheduleAppointment={goToScheduleAppointment}
          />
          <Footer />
        </div>
        <ScrollToTop />
      </div>
    );
  }

  if (currentPage === "search-results" && searchParams) {
    return (
      <div className="min-h-screen">
        <Header currentPage="search-results" />
        <div className="pt-16">
          <SearchResults 
            buildingId={searchParams.buildingId}
            floor={searchParams.floor}
            onBack={goBackFromSearch}
            onViewDetails={goToUnitDetails}
          />
          <Footer />
        </div>
        <ScrollToTop />
      </div>
    );
  }

  if (currentPage === "all-available-spaces") {
    return (
      <div className="min-h-screen">
        <Header currentPage="all-available-spaces" />
        <div className="pt-16">
          <AllAvailableSpaces 
            onBack={goToHome}
            onViewDetails={goToUnitDetails}
            initialFilters={allSpacesFilters}
          />
          <Footer />
        </div>
        <ScrollToTop />
      </div>
    );
  }

  if (currentPage === "properties") {
    return (
      <div className="min-h-screen">
        <Header currentPage="properties" />
        <div className="pt-16">
          <PropertiesPage 
            onBack={goToHome}
            onViewBuilding={handleBuildingNavigation}
          />
          <Footer />
        </div>
        <ScrollToTop />
      </div>
    );
  }

  if (currentPage === "tenant-portal") {
    return (
      <div className="min-h-screen">
        <Header currentPage="tenant-portal" />
        <div className="pt-16">
          <TenantsPortal />
          <Footer />
        </div>
        <ScrollToTop />
      </div>
    );
  }

  if (currentPage === "modern-management-team") {
    return (
      <div className="min-h-screen">
        <Header currentPage="home" />
        <div className="pt-16">
          <ModernManagementTeam />
          <Footer />
        </div>
        <ScrollToTop />
      </div>
    );
  }

  // Handle all sustainability placeholder pages
  if (currentPage === "sustainability-board-directors") {
    return (
      <div className="min-h-screen">
        <Header currentPage="sustainability" />
        <div className="pt-16">
          <BoardOfDirectors onBack={goToHome} />
        </div>
        <ScrollToTop />
      </div>
    );
  }

  if (currentPage === "sustainability-management-team") {
    return (
      <div className="min-h-screen">
        <Header currentPage="sustainability" />
        <div className="pt-16">
          <ManagementTeam onBack={goToHome} />
          <Footer />
        </div>
        <ScrollToTop />
      </div>
    );
  }

  if (currentPage === "sustainability-policies") {
    return (
      <div className="min-h-screen">
        <Header currentPage="sustainability" />
        <div className="pt-16">
          <PoliciesProcedures onBack={goToHome} />
          <Footer />
        </div>
        <ScrollToTop />
      </div>
    );
  }

  if (currentPage === "sustainability-compliance") {
    return (
      <div className="min-h-screen">
        <Header currentPage="sustainability" />
        <div className="pt-16">
          <Compliance onBack={goToHome} />
          <Footer />
        </div>
        <ScrollToTop />
      </div>
    );
  }

  if (currentPage === "sustainability-investor-relations") {
    return (
      <div className="min-h-screen">
        <Header currentPage="sustainability" />
        <div className="pt-16">
          <InvestorRelations 
            onBack={goToHome}
            onNavigateToFinancialReports={() => {
              // Financial Reports is admin-only, redirect to home
              goToHome();
            }}
          />
          <Footer />
        </div>
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header currentPage="home" />
      <main className="pt-16">
        <Hero onSearch={handleOfficeSearch} />
        <FeaturedListings onViewDetails={goToUnitDetails} onViewAllSpaces={goToAllAvailableSpaces} onViewBuildingProperty={handleBuildingNavigation} />
        <Statistics />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}