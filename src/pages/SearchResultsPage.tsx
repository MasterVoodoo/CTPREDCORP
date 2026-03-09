import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchResults from '@/components/SearchResults';

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const buildingId = searchParams.get('building') || '';
  const floor = parseInt(searchParams.get('floor') || '0');

  const handleBack = () => {
    navigate('/');
  };

  const handleViewDetails = (unitId: string) => {
    navigate(`/units/${unitId}`);
  };

  if (!buildingId || !floor) {
    navigate('/');
    return null;
  }

  return (
    <SearchResults 
      buildingId={buildingId}
      floor={floor}
      onBack={handleBack}
      onViewDetails={handleViewDetails}
    />
  );
}
