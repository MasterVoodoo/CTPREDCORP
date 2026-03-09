import { useParams, useNavigate } from 'react-router-dom';
import UnitDetailsPageComponent from '@/components/UnitDetailsPage';

export default function UnitDetailsPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleScheduleAppointment = () => {
    navigate('/schedule');
  };

  if (!unitId) {
    navigate('/');
    return null;
  }

  return (
    <UnitDetailsPageComponent 
      unitId={unitId}
      onBack={handleBack}
      onScheduleAppointment={handleScheduleAppointment}
    />
  );
}
