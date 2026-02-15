import { useState, useEffect, React } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { toast, Toaster } from "sonner";
import { Save, RefreshCw, Building2, ArrowLeft } from "lucide-react";
import { 
  getUnitsByBuilding,
  getBuildingById,
  Unit 
} from "../data/ctpData";

interface AdminPageProps {
  onBack: () => void;
}

interface EditableUnit extends Unit {
  originalData?: Unit;
  isModified?: boolean;
}

export default function AdminPage({ onBack }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState("ctp-red-corp");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null);
  
  // Editable unit data for each building
  const [redCorpUnits, setRedCorpUnits] = useState<EditableUnit[]>([]);
  const [alphaTowerUnits, setAlphaTowerUnits] = useState<EditableUnit[]>([]);
  const [bfBuildingUnits, setBfBuildingUnits] = useState<EditableUnit[]>([]);

  // Initialize data on component mount
  useEffect(() => {
    setRedCorpUnits(getUnitsByBuilding("ctp-red-corp").map(unit => ({ ...unit, originalData: unit })));
    setAlphaTowerUnits(getUnitsByBuilding("ctp-alpha-tower").map(unit => ({ ...unit, originalData: unit })));
    setBfBuildingUnits(getUnitsByBuilding("ctp-bf-building").map(unit => ({ ...unit, originalData: unit })));
  }, []);

  // Check for unsaved changes across all buildings
  useEffect(() => {
    const checkForChanges = () => {
      const redCorpModified = redCorpUnits.some(unit => unit.isModified);
      const alphaModified = alphaTowerUnits.some(unit => unit.isModified);
      const bfModified = bfBuildingUnits.some(unit => unit.isModified);
      
      setHasUnsavedChanges(redCorpModified || alphaModified || bfModified);
    };

    checkForChanges();
  }, [redCorpUnits, alphaTowerUnits, bfBuildingUnits]);

  // Get current units based on active tab
  const getCurrentUnits = () => {
    switch (activeTab) {
      case "ctp-red-corp":
        return redCorpUnits;
      case "ctp-alpha-tower":
        return alphaTowerUnits;
      case "ctp-bf-building":
        return bfBuildingUnits;
      default:
        return [];
    }
  };

  // Get building info based on active tab
  const getCurrentBuilding = () => {
    const building = getBuildingById(activeTab);
    return building || getBuildingById("ctp-red-corp");
  };

  // Update unit data
  const updateUnit = (unitId: string, field: keyof Unit, value: any) => {
    const updateUnitsArray = (units: EditableUnit[]) => {
      return units.map(unit => {
        if (unit.id === unitId) {
          const updatedUnit = { ...unit, [field]: value };
          // Check if this unit has been modified compared to original
          const isModified = JSON.stringify(updatedUnit) !== JSON.stringify(unit.originalData);
          return { ...updatedUnit, isModified };
        }
        return unit;
      });
    };

    switch (activeTab) {
      case "ctp-red-corp":
        setRedCorpUnits(updateUnitsArray);
        break;
      case "ctp-alpha-tower":
        setAlphaTowerUnits(updateUnitsArray);
        break;
      case "ctp-bf-building":
        setBfBuildingUnits(updateUnitsArray);
        break;
    }
  };

  // Handle tab change with unsaved changes check
  const handleTabChange = (newTab: string) => {
    if (hasUnsavedChanges) {
      setPendingTabChange(newTab);
      setShowSaveDialog(true);
    } else {
      setActiveTab(newTab);
    }
  };

  // Save changes (mock implementation)
  const saveChanges = () => {
    // In a real implementation, this would send data to a backend API
    console.log("Saving changes...");
    console.log("Red Corp Units:", redCorpUnits);
    console.log("Alpha Tower Units:", alphaTowerUnits);
    console.log("BF Building Units:", bfBuildingUnits);
    
    // Reset modification flags
    setRedCorpUnits(units => units.map(unit => ({ ...unit, isModified: false, originalData: { ...unit } })));
    setAlphaTowerUnits(units => units.map(unit => ({ ...unit, isModified: false, originalData: { ...unit } })));
    setBfBuildingUnits(units => units.map(unit => ({ ...unit, isModified: false, originalData: { ...unit } })));
    
    toast.success("Changes saved successfully!");
    setHasUnsavedChanges(false);
    
    // If there was a pending tab change, execute it now
    if (pendingTabChange) {
      setActiveTab(pendingTabChange);
      setPendingTabChange(null);
    }
    setShowSaveDialog(false);
  };

  // Discard changes
  const discardChanges = () => {
    setRedCorpUnits(getUnitsByBuilding("ctp-red-corp").map(unit => ({ ...unit, originalData: unit })));
    setAlphaTowerUnits(getUnitsByBuilding("ctp-alpha-tower").map(unit => ({ ...unit, originalData: unit })));
    setBfBuildingUnits(getUnitsByBuilding("ctp-bf-building").map(unit => ({ ...unit, originalData: unit })));
    
    setHasUnsavedChanges(false);
    
    // If there was a pending tab change, execute it now
    if (pendingTabChange) {
      setActiveTab(pendingTabChange);
      setPendingTabChange(null);
    }
    setShowSaveDialog(false);
    
    toast.info("Changes discarded");
  };

  // Handle back navigation with unsaved changes check
  const handleBackNavigation = () => {
    if (hasUnsavedChanges) {
      setShowSaveDialog(true);
      setPendingTabChange("back");
    } else {
      onBack();
    }
  };

  const currentUnits = getCurrentUnits();
  const currentBuilding = getCurrentBuilding();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleBackNavigation}
                className="flex items-center gap-2 text-gray-600 hover:text-white hover:bg-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Site
              </Button>
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-red-600" />
                <h1 className="text-xl font-semibold text-gray-900">CTP RED CORP Admin</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Unsaved Changes
                </Badge>
              )}
              <Button 
                onClick={saveChanges}
                disabled={!hasUnsavedChanges}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button 
                variant="outline"
                onClick={discardChanges}
                disabled={!hasUnsavedChanges}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Discard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger value="ctp-red-corp" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                CTP Red Corp
              </TabsTrigger>
              <TabsTrigger value="ctp-alpha-tower" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                CTP Alpha Tower
              </TabsTrigger>
              <TabsTrigger value="ctp-bf-building" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                CTP BF Building
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {currentBuilding?.displayName}
                </h2>
                <p className="text-gray-600">{currentBuilding?.location}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>Total Units: {currentUnits.length}</span>
                  <span>Available: {currentUnits.filter(u => u.status === "Available").length}</span>
                  <span>Unavailable: {currentUnits.filter(u => u.status === "Unavailable").length}</span>
                </div>
              </div>

              {/* Units Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Unit ID</TableHead>
                      <TableHead className="font-semibold">Title</TableHead>
                      <TableHead className="font-semibold">Floor</TableHead>
                      <TableHead className="font-semibold">Size (sq m)</TableHead>
                      <TableHead className="font-semibold">Capacity</TableHead>
                      <TableHead className="font-semibold">Price (₱)</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Condition</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUnits.map((unit) => (
                      <TableRow 
                        key={unit.id} 
                        className={unit.isModified ? "bg-yellow-50 border-l-4 border-l-yellow-400" : ""}
                      >
                        <TableCell className="font-mono text-sm">
                          {unit.id}
                          {unit.isModified && (
                            <Badge variant="secondary" className="ml-2 text-xs bg-yellow-100 text-yellow-800">
                              Modified
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            value={unit.title}
                            onChange={(e) => updateUnit(unit.id, "title", e.target.value)}
                            className="min-w-[200px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={unit.floor}
                            onChange={(e) => updateUnit(unit.id, "floor", parseInt(e.target.value) || 1)}
                            className="w-20"
                            min="1"
                            max="6"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={unit.size}
                            onChange={(e) => updateUnit(unit.id, "size", parseInt(e.target.value) || 0)}
                            className="w-24"
                            min="0"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={unit.capacity}
                            onChange={(e) => updateUnit(unit.id, "capacity", parseInt(e.target.value) || 0)}
                            className="w-20"
                            min="0"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600 font-medium">₱</span>
                            <Input
                              type="number"
                              value={unit.price}
                              onChange={(e) => updateUnit(unit.id, "price", parseInt(e.target.value) || 0)}
                              className="w-28"
                              min="0"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={unit.status} 
                            onValueChange={(value) => updateUnit(unit.id, "status", value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Available">Available</SelectItem>
                              <SelectItem value="Unavailable">Unavailable</SelectItem>
                              <SelectItem value="Taken">Taken</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={unit.condition || "Bare"} 
                            onValueChange={(value) => updateUnit(unit.id, "condition", value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Bare">Bare</SelectItem>
                              <SelectItem value="Warm Shell">Warm Shell</SelectItem>
                              <SelectItem value="Fitted">Fitted</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Save/Discard Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. What would you like to do?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={discardChanges}>
              Discard Changes
            </AlertDialogCancel>
            <AlertDialogAction onClick={saveChanges}>
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}