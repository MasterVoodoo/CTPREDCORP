import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Activity,
  LogOut,
  Shield,
  UserPlus,
  Settings,
  BarChart3
} from 'lucide-react';
import AdminUserManagement from '../components/AdminUserManagement';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'super_admin' | 'admin';
  fullName: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = async () => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (!token || !userData) {
      navigate('/admin/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Auth verification failed:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('adminToken');

    try {
      await fetch('http://localhost:5000/api/admin/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">CTP RED CORP</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                <Shield className={`w-5 h-5 ${user?.role === 'super_admin' ? 'text-purple-600' : 'text-blue-600'}`} />
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
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <nav className="flex gap-1 p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Overview
            </button>
            {user?.role === 'super_admin' && (
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5" />
                User Management
              </button>
            )}
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'logs'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Activity className="w-5 h-5" />
              Activity Logs
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <Building2 className="w-8 h-8 text-blue-600" />
                    <span className="text-sm font-medium text-gray-500">Buildings</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-gray-600 mt-2">Total Properties</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                    <span className="text-sm font-medium text-gray-500">Units</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">92</p>
                  <p className="text-sm text-gray-600 mt-2">Total Available</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <Activity className="w-8 h-8 text-purple-600" />
                    <span className="text-sm font-medium text-gray-500">Occupancy</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">96%</p>
                  <p className="text-sm text-gray-600 mt-2">Current Rate</p>
                </div>
              </div>

              <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <Settings className="w-6 h-6 text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Manage Content</p>
                      <p className="text-sm text-gray-600">Update buildings and units</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">View Reports</p>
                      <p className="text-sm text-gray-600">Financial and analytics</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && user?.role === 'super_admin' && (
            <AdminUserManagement />
          )}

          {activeTab === 'logs' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity Logs</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <p className="text-gray-600">Activity log viewer coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;