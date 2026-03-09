import { useNavigate } from 'react-router-dom';
import AdminDashboard from '@/admin/pages/AdminDashboard';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return <AdminDashboard onLogout={handleLogout} />;
}
