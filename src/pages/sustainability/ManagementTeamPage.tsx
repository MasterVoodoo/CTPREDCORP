import { useNavigate } from 'react-router-dom';
import ManagementTeam from '@/components/ManagementTeam';

export default function ManagementTeamPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return <ManagementTeam onBack={handleBack} />;
}
