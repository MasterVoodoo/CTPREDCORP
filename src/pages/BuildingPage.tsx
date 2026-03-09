import { useParams, useNavigate } from 'react-router-dom';
import DynamicBuildingProperty from '@/components/DynamicBuildingProperty';
import CtpRedCorpProperty from '@/components/CtpRedCorpProperty';
import CtpAlphaTowerProperty from '@/components/CtpAlphaTowerProperty';
import CtpBfBuildingProperty from '@/components/CtpBfBuildingProperty';

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

  if (buildingId === 'ctp-asean-tower') {
    return <CtpRedCorpProperty onBack={handleBack} onViewDetails={handleViewDetails} />;
  }

  if (buildingId === 'ctp-alpha-tower') {
    return <CtpAlphaTowerProperty onBack={handleBack} onViewDetails={handleViewDetails} />;
  }

  if (buildingId === 'ctp-bf-building') {
    return <CtpBfBuildingProperty onBack={handleBack} onViewDetails={handleViewDetails} />;
  }

  return (
    <DynamicBuildingProperty 
      buildingId={buildingId}
      onBack={handleBack}
      onViewDetails={handleViewDetails}
    />
  );
}
