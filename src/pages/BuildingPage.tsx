import { useParams, useNavigate } from 'react-router-dom';
import DynamicBuildingProperty from '@/components/DynamicBuildingProperty';

export default function BuildingPage() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleViewDetails = (unitId: string) => {
    navigate(`/units/${unitId}`);
  };

  if (!buildingId) {  
    navigate('/properties');
    return null;
  }

  // Use DynamicBuildingProperty for ALL buildings (including legacy ones)
  // This ensures all buildings fetch data from the database
  return (
    <DynamicBuildingProperty 
      buildingId={buildingId}
      onBack={handleBack}
      onViewDetails={handleViewDetails}
    />
  );
}
