import { useNavigate } from 'react-router-dom';
import PoliciesProcedures from '@/components/PoliciesProcedures';

export default function PoliciesProceduresPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return <PoliciesProcedures onBack={handleBack} />;
}
