import {
  LayoutDashboard,
  Home,
  Users,
  Activity,
  CalendarCheck,
} from 'lucide-react';
import CTPRED_LOGO from '../../assets/CTPRED_LOGO.png';

export type AdminTabId =
  | 'overview'
  | 'properties'
  | 'properties-add-building'
  | 'properties-add-units'
  | 'users'
  | 'logs'
  | 'appointments';

export interface AdminSidebarProps {
  /** Whether the sidebar is expanded (desktop) or visible (mobile) */
  open: boolean;
  onToggle: () => void;
  activeTab: AdminTabId;
  onNavigate: (tab: AdminTabId) => void;
  /** Show User Management link (e.g. for super_admin) */
  showUserManagement?: boolean;
}

const SIDEBAR_WIDTH_EXPANDED = 256;
const SIDEBAR_WIDTH_COLLAPSED = 72;

export default function AdminSidebar({
  open,
  onToggle,
  activeTab,
  onNavigate,
  showUserManagement = false,
}: AdminSidebarProps) {
  const isPropertyTab = (t: AdminTabId) =>
    t === 'properties' || t === 'properties-add-building' || t === 'properties-add-units';

  const handleNavigate = (tab: AdminTabId) => {
    onNavigate(tab);
  };

  return (
    <>
      <style>{`
        .admin-sidebar {
          flex-shrink: 0;
          height: 100vh;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: white;
          border-right: 1px solid #e5e7eb;
          transition: width 0.3s ease-out, transform 0.3s ease-out;
          overflow: hidden;
        }
        @media (min-width: 1024px) {
          .admin-sidebar {
            position: sticky;
            top: 0;
            width: ${open ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED}px;
            transform: none;
          }
        }
        @media (max-width: 1023px) {
          .admin-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            z-index: 40;
            width: ${SIDEBAR_WIDTH_EXPANDED}px;
            transform: translateX(${open ? 0 : -100}%);
            box-shadow: 4px 0 6px -1px rgba(0, 0, 0, 0.1);
          }
        }
        .admin-sidebar .sidebar-link { transition: all 0.2s ease; }
        .admin-sidebar .sidebar-link:hover:not(.active) { background-color: #FEE2E2; }
        .admin-sidebar .sidebar-link.active { background: #1F2937; color: white; }
        .admin-sidebar .sidebar-link.active svg { color: white !important; }
        .admin-sidebar.collapsed .sidebar-text { opacity: 0; width: 0; overflow: hidden; pointer-events: none; }
        .admin-sidebar.collapsed .sidebar-submenu { opacity: 0; height: 0; overflow: hidden; margin: 0; padding: 0; border: none; }
        .admin-sidebar.collapsed .sidebar-submenu-toggle { opacity: 0; width: 0; overflow: hidden; pointer-events: none; }
      `}</style>

      <aside
        className={`admin-sidebar ${!open ? 'collapsed' : ''}`}
        aria-label="Admin navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-center h-16 px-3 border-b border-gray-200 flex-shrink-0 min-h-16">
          <img
            src={CTPRED_LOGO}
            alt="CTP RED CORP"
            className={`object-contain flex-shrink-0 transition-all duration-300 ${
              open ? 'h-10 w-auto max-w-[200px]' : 'h-8 w-8'
            }`}
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1">
          <button
            onClick={() => handleNavigate('overview')}
            className={`sidebar-link w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-left font-medium ${
              activeTab === 'overview' ? 'active' : 'text-gray-700'
            }`}
          >
            <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
            <span className="sidebar-text whitespace-nowrap">Dashboard</span>
          </button>

          {/* Property Management */}
          <button
            onClick={() => handleNavigate('properties')}
            className={`sidebar-link w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-left font-medium ${
              isPropertyTab(activeTab) ? 'active' : 'text-gray-700'
            }`}
          >
            <Home className="h-5 w-5 flex-shrink-0" />
            <span className="sidebar-text whitespace-nowrap">Property Management</span>
          </button>

          {showUserManagement && (
            <button
              onClick={() => handleNavigate('users')}
              className={`sidebar-link w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-left font-medium ${
                activeTab === 'users' ? 'active' : 'text-gray-700'
              }`}
            >
              <Users className="h-5 w-5 flex-shrink-0" />
              <span className="sidebar-text whitespace-nowrap">User Management</span>
            </button>
          )}

          <button
            onClick={() => handleNavigate('logs')}
            className={`sidebar-link w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-left font-medium ${
              activeTab === 'logs' ? 'active' : 'text-gray-700'
            }`}
          >
            <Activity className="h-5 w-5 flex-shrink-0" />
            <span className="sidebar-text whitespace-nowrap">Activity Logs</span>
          </button>

          <button
            onClick={() => handleNavigate('appointments')}
            className={`sidebar-link w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-left font-medium ${
              activeTab === 'appointments' ? 'active' : 'text-gray-700'
            }`}
          >
            <CalendarCheck className="h-5 w-5 flex-shrink-0" />
            <span className="sidebar-text whitespace-nowrap">Appointment Management</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
