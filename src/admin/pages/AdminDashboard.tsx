import { useEffect, useState } from 'react';
import { Building2, BarChart3, Users, LogOut, Grid3x3 } from 'lucide-react';
import PropertyManagement from '../components/PropertyManagement';
import UserManagement from '../components/UserManagement';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'super_admin' | 'admin';
  fullName: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [currentPage, setCurrentPage] = useState<'overview' | 'properties' | 'users'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const userData = localStorage.getItem('adminUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      await fetch('http://localhost:5000/api/admin/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      onLogout();
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Building2 size={32} className="text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">CTP RED CORP</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.fullName?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">
                    {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-1">
          <nav className="flex gap-2">
            <button
              onClick={() => setCurrentPage('overview')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                currentPage === 'overview'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={20} />
              Overview
            </button>
            <button
              onClick={() => setCurrentPage('properties')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                currentPage === 'properties'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Building2 size={20} />
              Property Management
            </button>
            {user?.role === 'super_admin' && (
              <button
                onClick={() => setCurrentPage('users')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentPage === 'users'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users size={20} />
                User Management
              </button>
            )}
          </nav>
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {currentPage === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <Building2 size={32} className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-500">Buildings</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-gray-600 mt-2">Total Properties</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <Grid3x3 size={32} className="text-green-600" />
                    <span className="text-sm font-medium text-gray-500">Units</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">92</p>
                  <p className="text-sm text-gray-600 mt-2">Available Spaces</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <BarChart3 size={32} className="text-purple-600" />
                    <span className="text-sm font-medium text-gray-500">Occupancy</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">96%</p>
                  <p className="text-sm text-gray-600 mt-2">Current Rate</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setCurrentPage('properties')}
                    className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <Building2 size={24} className="text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Manage Properties</p>
                      <p className="text-sm text-gray-600">Edit buildings and units</p>
                    </div>
                  </button>
                  {user?.role === 'super_admin' && (
                    <button
                      onClick={() => setCurrentPage('users')}
                      className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all"
                    >
                      <Users size={24} className="text-blue-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Manage Users</p>
                        <p className="text-sm text-gray-600">Add or edit admin users</p>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentPage === 'properties' && <PropertyManagement />}
          {currentPage === 'users' && user?.role === 'super_admin' && <UserManagement />}
        </div>
      </div>
    </div>
  );
}