import { useState, useEffect } from 'react';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminPage from '../src/components/AdminPage';

export default function AdminApp() {
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | 'content'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    } else {
      setIsAuthenticated(false);
      setCurrentPage('login');
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const navigateToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const navigateToContent = () => {
    setCurrentPage('content');
  };

  // Login Page
  if (!isAuthenticated || currentPage === 'login') {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // Dashboard Page
  if (currentPage === 'dashboard') {
    return (
      <AdminDashboard 
        onLogout={handleLogout}
        onNavigateToContent={navigateToContent}
      />
    );
  }

  // Content Management Page
  if (currentPage === 'content') {
    return <AdminPage onBack={navigateToDashboard} />;
  }

  return null;
}