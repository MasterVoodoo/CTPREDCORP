import { useNavigate } from 'react-router-dom';
import FinancialReports from '../../src/components/FinancialReports';

interface AdminFinancialReportsProps {
  onLogout: () => void;
}

const AdminFinancialReports = ({ onLogout }: AdminFinancialReportsProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <FinancialReports 
        onBack={() => navigate('/admin/dashboard')} 
        onNavigateToInvestorRelations={() => {
          // Investor Relations is still accessible from main site
          window.location.href = '/#sustainability-investor-relations';
        }}
      />
    </div>
  );
};

export default AdminFinancialReports;