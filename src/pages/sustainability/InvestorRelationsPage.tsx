import { useNavigate } from 'react-router-dom';
import InvestorRelations from '@/components/InvestorRelations';

export default function InvestorRelationsPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleNavigateToFinancialReports = () => {
    navigate('/');
  };

  return (
    <InvestorRelations 
      onBack={handleBack}
      onNavigateToFinancialReports={handleNavigateToFinancialReports}
    />
  );
}
