import { useNavigate } from 'react-router-dom';
import Hero from '@/components/shared/Hero';
import FeaturedListings from '@/components/shared/FeaturedListings';
import Statistics from '@/components/shared/Statistics';

export default function HomePage() {
  const navigate = useNavigate();

  const handleSearch = (building: string, condition: string) => {
    const params = new URLSearchParams();
    if (building) params.set('building', building);
    if (condition) params.set('condition', condition);
    navigate(`/spaces?${params.toString()}`);
  };

  const handleViewDetails = (unitId: string) => {
    navigate(`/units/${unitId}`);
  };

  const handleViewAllSpaces = () => {
    navigate('/spaces');
  };

  const handleViewBuildingProperty = (buildingId: string) => {
    navigate(`/properties/${buildingId}`);
  };

  return (
    <>
      <Hero onSearch={handleSearch} />
      <FeaturedListings 
        onViewDetails={handleViewDetails}
        onViewAllSpaces={handleViewAllSpaces}
        onViewBuildingProperty={handleViewBuildingProperty}
      />
      <Statistics />
    </>
  );
}
