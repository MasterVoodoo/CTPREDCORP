import { useState, useEffect } from 'react';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminPage from './components/AdminPage';

export default function AdminApp() {
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | 'content'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (token && userData) {
      setIsAuthenticated(true);
      // Check URL hash for routing
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin-content') {
        setCurrentPage('content');
      } else if (hash === 'admin-dashboard' || hash === '') {
        setCurrentPage('dashboard');
      }
    } else {
      setIsAuthenticated(false);
      setCurrentPage('login');
    }
  }, []);

  useEffect(() => {
    // Listen for hash changes within admin
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      if (!isAuthenticated) {
        setCurrentPage('login');
        return;
      }

      if (hash === 'admin-content') {
        setCurrentPage('content');
      } else if (hash === 'admin-dashboard' || hash === '') {
        setCurrentPage('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
    window.location.hash = 'admin-dashboard';
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setCurrentPage('login');
    window.location.hash = '';
  };

  const navigateToDashboard = () => {
    setCurrentPage('dashboard');
    window.location.hash = 'admin-dashboard';
  };

  const navigateToContent = () => {
    setCurrentPage('content');
    window.location.hash = 'admin-content';
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
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminPage onBack={navigateToDashboard} />
      </div>
    );
  }

  return null;
}