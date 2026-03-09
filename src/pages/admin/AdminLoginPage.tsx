import { useNavigate } from 'react-router-dom';
import AdminLogin from '@/admin/pages/AdminLogin';

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/admin');
  };

  return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
}
