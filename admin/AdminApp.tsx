import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminContent from './pages/AdminContent';

function AdminRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    setIsAuthenticated(!!(token && userData));
    setLoading(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/admin/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
            <Navigate to="/admin/dashboard" replace /> : 
            <AdminLogin onLoginSuccess={handleLogin} />
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? 
            <AdminDashboard onLogout={handleLogout} /> : 
            <Navigate to="/admin/login" replace />
        } 
      />
      <Route 
        path="/content" 
        element={
          isAuthenticated ? 
            <AdminContent onLogout={handleLogout} /> : 
            <Navigate to="/admin/login" replace />
        } 
      />
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

export default function AdminApp() {
  return (
    <BrowserRouter basename="/admin">
      <AdminRoutes />
    </BrowserRouter>
  );
}