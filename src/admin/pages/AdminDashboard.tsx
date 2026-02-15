import { useEffect, useState } from 'react';
import { Building2, BarChart3, Users, LogOut, Grid3x3 } from 'lucide-react';
import PropertyManagement from '../components/PropertyManagement';
import UserManagement from '../components/UserManagement';
import FinancialReports from '../components/FinancialReports';

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

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs' | 'financial'>('overview');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = async () => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (!token || !userData) {
      onLogout();
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Authentication failed');
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Auth verification failed:', error);
      onLogout();
    } finally {
      setLoading(false);
    }
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .tab-button { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .tab-button:hover:not(.active) { transform: translateY(-2px); background-color: #FEE2E2 !important; }
        .tab-button.active { background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%) !important; color: white !important; box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.4), 0 2px 4px -1px rgba(220, 38, 38, 0.3); }
        .tab-button.active svg { color: white !important; }
        .quick-action-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .quick-action-card:hover { transform: translateY(-4px); border-color: #DC2626 !important; background-color: #FEF2F2 !important; box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.2), 0 4px 6px -2px rgba(220, 38, 38, 0.1); }
        .content-fade-in { animation: slideIn 0.5s ease-out; }
      `}</style>

      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Building2 size={32} className="text-blue-600" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">CTP RED CORP</h1>
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
                  <p className="text-xs text-red-600 font-medium">{user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</p>
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
            <button onClick={() => setActiveTab('logs')} className={`tab-button flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${activeTab === 'logs' ? 'active' : 'text-gray-600'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              Activity Logs
            </button>
          </nav>
        </div>

        <div className="content-fade-in">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-lg shadow-sm border border-red-100">
                  <div className="flex items-center justify-between mb-4">
                    <Building2 size={32} className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-500">Buildings</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-gray-600 mt-2">Total Properties</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-lg shadow-sm border border-emerald-100">
                  <div className="flex items-center justify-between mb-4">
                    <Grid3x3 size={32} className="text-green-600" />
                    <span className="text-sm font-medium text-gray-500">Units</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">92</p>
                  <p className="text-sm text-gray-600 mt-2">Total Available</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg shadow-sm border border-purple-100">
                  <div className="flex items-center justify-between mb-4">
                    <BarChart3 size={32} className="text-purple-600" />
                    <span className="text-sm font-medium text-gray-500">Occupancy</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">96%</p>
                  <p className="text-sm text-gray-600 mt-2">Current Rate</p>
                </div>
              </div>
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
          {activeTab === 'financial' && (
            <div>
              <FinancialReports 
                onBack={() => setActiveTab('overview')} 
                onNavigateToInvestorRelations={() => {
                  // Investor Relations is still accessible from main site
                  window.location.href = '/#sustainability-investor-relations';
                }}
              />
            </div>
          )}
          {activeTab === 'users' && user?.role === 'super_admin' && <UserManagement />}
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