import { useState, useMemo } from "react";
import { Search, Building } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card } from "./ui/card";
import { getBuildingsList, companyOverview, getPublicUnits } from "../data/ctpData";
import PanningVideo from "../assets/ctp_pan.gif";
// dsadasdasdasd

interface HeroProps {
  onSearch?: (building: string, condition: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");

  // Dynamically get buildings list
  const buildings = useMemo(() => getBuildingsList(), []);

  // Dynamically extract all unique conditions from available units
  const conditionOptions = useMemo(() => {
    const allUnits = getPublicUnits();
    const conditions = new Set<string>();
    
    allUnits.forEach(unit => {
      if (unit.condition) {
        conditions.add(unit.condition);
      }
    });
    
    // Convert to array and sort alphabetically
    return Array.from(conditions).sort().map(condition => ({
      value: condition,
      label: condition
    }));
  }, []);

  const handleSearch = () => {
    if (onSearch) {
      // Pass the search parameters - building is optional, condition is optional
      onSearch(selectedBuilding, selectedCondition);
    }
  };

  return (
    <>
      {/* Hero Video Section */}
      <section className="relative w-full h-[66vh] bg-black overflow-hidden">
        <style>{`
          iframe {
            filter: contrast(1.1) saturate(1.1);
          }
          iframe::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: 100px;
            height: 50px;
            background: black;
            z-index: 10;
          }
        `}</style>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <img
              className="absolute top-1/2 left-1/2 w-[177.77vh] h-[56.25vw] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-110 object-cover"
              src={PanningVideo}
              // autoPlay
              // muted
              // loop
              // playsInline
            />
            <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
          </div>

          <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
        </div>

        {/* Title Over Video */}
        <div className="absolute bottom-12 left-8 text-left">
          <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight">
            <span className="mb-1 block text-[80px]">
              {companyOverview.mission.split(".")[0]}.
            </span>
            <span className="block p-[0px] pt-[0px] pr-[0px] pb-[8px] pl-[0px] text-[80px]">
              {companyOverview.mission.split(".")[1]}.
            </span>
            <span className="block text-primary text-base md:text-2xl mt-[3px] mr-[1px] mb-[7px] ml-[0px] text-[24px] pt-[0px] pr-[1px] pb-[0px] pl-[0px]">
              {companyOverview.tagline}
            </span>
          </h1>
        </div>
      </section>

      {/* Search Bar Overlapping Video */}
      <Card className="max-w-4xl mx-auto -mt-20 z-10 relative p-6 bg-white/95 backdrop-blur-sm shadow-xl">
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <label className="block text-center text-gray-700">
              Building Location
            </label>
            <Select
              value={selectedBuilding}
              onValueChange={setSelectedBuilding}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Any building" />
              </SelectTrigger>
              <SelectContent>
                {buildings.map((building) => (
                  <SelectItem
                    key={building.id}
                    value={building.id}
                    className="py-3 px-4 text-base cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Building className="h-8 w-8" />
                      <div>
                        <div className="font-medium">
                          {building.displayName}
                        </div>
                        <div className="text-sm text-gray-500 cursor-pointer">
                          {building.location}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-center text-gray-700">Condition</label>
            <Select
              value={selectedCondition}
              onValueChange={setSelectedCondition}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Any condition" />
              </SelectTrigger>
              <SelectContent>
                {conditionOptions.map((condition) => (
                  <SelectItem
                    key={condition.value}
                    value={condition.value}
                    className="py-3 px-4 text-base cursor-pointer"
                  >
                    {condition.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSearch}
            className="bg-primary hover:bg-accent text-white h-10 cursor-pointer"
          >
            <Search className="h-4 w-4 mr-2" />
            Search Offices
          </Button>
        </div>
      </Card>
    </>
  );
}
