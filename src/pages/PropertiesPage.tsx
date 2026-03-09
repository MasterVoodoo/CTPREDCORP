import { useNavigate } from 'react-router-dom';
import PropertiesPageComponent from '@/components/PropertiesPage';

export default function PropertiesPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleViewBuilding = (buildingId: string) => {
    navigate(`/properties/${buildingId}`);
  };

  return (
    <PropertiesPageComponent 
      onBack={handleBack}
      onViewBuilding={handleViewBuilding}
    />
  );
}
