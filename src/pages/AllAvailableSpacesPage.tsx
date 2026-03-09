import { useNavigate, useSearchParams } from 'react-router-dom';
import AllAvailableSpaces from '@/components/AllAvailableSpaces';

export default function AllAvailableSpacesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleBack = () => {
    navigate('/');
  };

  const handleViewDetails = (unitId: string) => {
    navigate(`/units/${unitId}`);
  };

  const initialFilters = {
    building: searchParams.get('building') || '',
    condition: searchParams.get('condition') || '',
  };

  return (
    <AllAvailableSpaces 
      onBack={handleBack}
      onViewDetails={handleViewDetails}
      initialFilters={initialFilters}
    />
  );
}
