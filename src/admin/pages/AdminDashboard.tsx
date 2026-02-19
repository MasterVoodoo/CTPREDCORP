import { useEffect, useState } from 'react';
import PropertyManagement from '../components/PropertyManagement';
import UserManagement from '../components/UserManagement';
import AdminSidebar, { type AdminTabId } from '../components/AdminSidebar';
import { Building2, Menu } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<AdminTabId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [buildingCount, setBuildingCount] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState(true);

  const setTabAndCloseSidebar = (tab: AdminTabId) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) setSidebarOpen(false);
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchBuildingCount();
    }
  }, [activeTab]);

  const fetchBuildingCount = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/buildings`);
      if (response.ok) {
        const buildings = await response.json();
        setBuildingCount(buildings.length);
      }
    } catch (error) {
      console.error('Failed to fetch building count:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const verifyAuth = async () => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (!token || !userData) {
      onLogout();
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/verify`, {
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

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/admin/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setShowLogoutConfirm(false);
      onLogout();
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
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
    <div className="min-h-screen bg-gray-50 flex">
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .sidebar-link { transition: all 0.2s ease; }
        .sidebar-link:hover { background-color: #FEE2E2; }
        .sidebar-link.active { background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: white; }
        .sidebar-link.active svg { color: white; }
        .quick-action-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .quick-action-card:hover { transform: translateY(-4px); border-color: #DC2626 !important; background-color: #FEF2F2 !important; box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.2), 0 4px 6px -2px rgba(220, 38, 38, 0.1); }
        .content-fade-in { animation: slideIn 0.5s ease-out; }
        .stat-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.15); }
        .modal-overlay { animation: fadeIn 0.2s ease-out; backdrop-filter: blur(2px); }
        .modal-content { animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .loading-pulse { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="modal-content bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirm Logout</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out? You will need to sign in again to access the admin dashboard.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar overlay (mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <AdminSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        activeTab={activeTab}
        onNavigate={setTabAndCloseSidebar}
        showUserManagement={user?.role === 'super_admin'}
      />

      {/* Main: header + content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="hidden lg:block flex-1" />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={user?.role === 'super_admin' ? '#9333EA' : '#DC2626'} strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                    <p className="text-xs text-red-600 font-medium">{user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</p>
                  </div>
                </div>
                <button onClick={handleLogoutClick} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="content-fade-in">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Buildings Card - Red - DYNAMIC */}
                <div className="stat-card bg-white p-6 rounded-xl shadow-md border-2 border-red-100 hover:border-red-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center border-2 border-red-200">
                      <Building2 className="h-8 w-8 text-red-600" />
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">BUILDINGS</span>
                  </div>
                  {loadingStats ? (
                    <div className="loading-pulse">
                      <div className="h-10 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-4xl font-extrabold text-gray-900 mb-1">{buildingCount}</p>
                      <p className="text-sm text-gray-600 font-medium">Total Properties</p>
                    </>
                  )}
                </div>

                {/* Units Card - Red */}
                <div className="stat-card bg-white p-6 rounded-xl shadow-md border-2 border-red-100 hover:border-red-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center border-2 border-red-200">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">UNITS</span>
                  </div>
                  <p className="text-4xl font-extrabold text-gray-900 mb-1">92</p>
                  <p className="text-sm text-gray-600 font-medium">Total Available</p>
                </div>

                {/* Occupancy Card - Red */}
                <div className="stat-card bg-white p-6 rounded-xl shadow-md border-2 border-red-100 hover:border-red-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center border-2 border-red-200">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">OCCUPANCY</span>
                  </div>
                  <p className="text-4xl font-extrabold text-gray-900 mb-1">96%</p>
                  <p className="text-sm text-gray-600 font-medium">Current Rate</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div onClick={() => setTabAndCloseSidebar('properties')} className="quick-action-card flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                    </div>
                    <div className="text-left"><p className="font-semibold text-gray-900">Manage Properties</p><p className="text-sm text-gray-600">Update buildings and units</p></div>
                  </div>
                  {user?.role === 'super_admin' && (
                    <div onClick={() => setTabAndCloseSidebar('users')} className="quick-action-card flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                      </div>
                      <div className="text-left"><p className="font-semibold text-gray-900">Manage Users</p><p className="text-sm text-gray-600">Add or edit admin users</p></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'properties' && <PropertyManagement />}
          {activeTab === 'properties-add-building' && <PropertyManagement openAddBuildingModal />}
          {activeTab === 'properties-add-units' && <PropertyManagement openAddUnitModal />}
          {activeTab === 'users' && user?.role === 'super_admin' && <UserManagement />}
          {activeTab === 'logs' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity Logs</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <p className="text-gray-600">Activity log viewer coming soon...</p>
              </div>
            </div>
          )}
          {activeTab === 'appointments' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Appointment Management</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <p className="text-gray-600">Appointment management coming soon...</p>
              </div>
            </div>
          )}
        </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;