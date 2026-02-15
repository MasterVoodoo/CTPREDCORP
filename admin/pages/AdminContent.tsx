import { useNavigate } from 'react-router-dom';
import AdminPage from '../../src/components/AdminPage';

interface AdminContentProps {
  onLogout: () => void;
}

const AdminContent = ({ onLogout }: AdminContentProps) => {
  const navigate = useNavigate();

  return (
    <AdminPage onBack={() => navigate('/admin/dashboard')} />
  );
};

export default AdminContent;