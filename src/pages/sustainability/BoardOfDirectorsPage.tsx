import { useNavigate } from 'react-router-dom';
import BoardOfDirectors from '@/components/BoardOfDirectors';

export default function BoardOfDirectorsPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return <BoardOfDirectors onBack={handleBack} />;
}
