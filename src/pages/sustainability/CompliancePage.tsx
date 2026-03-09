import { useNavigate } from 'react-router-dom';
import Compliance from '@/components/Compliance';

export default function CompliancePage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return <Compliance onBack={handleBack} />;
}
