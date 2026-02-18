import { useState } from 'react';
import {
  Building,
  LayoutDashboard,
  Home,
  PlusCircle,
  Users,
  Activity,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';

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
const SIDEBAR_WIDTH_COLLAPSED = 60;

export default function AdminSidebar({
  open,
  onToggle,
  activeTab,
  onNavigate,
  showUserManagement = false,
}: AdminSidebarProps) {
  const [propertySubmenuOpen, setPropertySubmenuOpen] = useState(false);

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
            position: relative;
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
        .admin-sidebar .sidebar-link:hover { background-color: #FEE2E2; }
        .admin-sidebar .sidebar-link.active { background: linear-gradient(135deg,rgb(76, 74, 74) 0%,rgb(51, 50, 50) 100%); color: white; }
        .admin-sidebar .sidebar-link.active svg { color: white; }
        .admin-sidebar.collapsed .sidebar-text { opacity: 0; width: 0; overflow: hidden; pointer-events: none; }
        .admin-sidebar.collapsed .sidebar-submenu { opacity: 0; height: 0; overflow: hidden; margin: 0; padding: 0; border: none; }
        .admin-sidebar.collapsed .sidebar-submenu-toggle { opacity: 0; width: 0; overflow: hidden; pointer-events: none; }
      `}</style>

      <aside
        className={`admin-sidebar ${!open ? 'collapsed' : ''}`}
        aria-label="Admin navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-3 border-b border-gray-200 flex-shrink-0 min-h-16">
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building className="h-5 w-5 text-white" />
            </div>
            <span
              className={`font-bold text-gray-900 truncate whitespace-nowrap transition-all duration-200 ${
                open ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
              }`}
            >
              CTP RED
            </span>
          </div>
          {/* <button
            type="button"
            onClick={onToggle}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
            aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {open ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
          </button> */}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1">
          <button
            onClick={() => handleNavigate('overview')}
            className={`sidebar-link w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-left font-medium ${
              activeTab === 'overview' ? 'active' : 'text-gray-700'
            }`}
          >
            <LayoutDashboard className="h-5 w-5 flex-shrink-0 text-red-600" />
            <span className="sidebar-text whitespace-nowrap">Dashboard</span>
          </button>

          {/* Property Management (expandable) */}
          <div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleNavigate('properties')}
                className={`sidebar-link flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-left font-medium min-w-0 ${
                  isPropertyTab(activeTab) ? 'active' : 'text-gray-700'
                }`}
              >
                <Home className="h-5 w-5 flex-shrink-0 text-red-600" />
                <span className="sidebar-text whitespace-nowrap">Property Management</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPropertySubmenuOpen((prev) => !prev);
                }}
                className="sidebar-submenu-toggle p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                aria-label={propertySubmenuOpen ? 'Collapse' : 'Expand'}
              >
                {propertySubmenuOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </div>
            {propertySubmenuOpen && (
              <div className="sidebar-submenu ml-4 mt-1 space-y-0.5 border-l-2 border-gray-200 pl-3 transition-all duration-200">
                <button
                  onClick={() => handleNavigate('properties-add-building')}
                  className={`sidebar-link w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm ${
                    activeTab === 'properties-add-building' ? 'active' : 'text-gray-600'
                  }`}
                >
                  <PlusCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="sidebar-text whitespace-nowrap">Add Building</span>
                </button>
                <button
                  onClick={() => handleNavigate('properties-add-units')}
                  className={`sidebar-link w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm ${
                    activeTab === 'properties-add-units' ? 'active' : 'text-gray-600'
                  }`}
                >
                  <PlusCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="sidebar-text whitespace-nowrap">Add Units</span>
                </button>
              </div>
            )}
          </div>

          {showUserManagement && (
            <button
              onClick={() => handleNavigate('users')}
              className={`sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left font-medium ${
                activeTab === 'users' ? 'active' : 'text-gray-700'
              }`}
            >
              <Users className="h-5 w-5 flex-shrink-0 text-red-600" />
              <span className="sidebar-text whitespace-nowrap">User Management</span>
            </button>
          )}

          <button
            onClick={() => handleNavigate('logs')}
            className={`sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left font-medium ${
              activeTab === 'logs' ? 'active' : 'text-gray-700'
            }`}
          >
            <Activity className="h-5 w-5 flex-shrink-0 text-red-600" />
            <span className="sidebar-text whitespace-nowrap">Activity Logs</span>
          </button>

          <button
            onClick={() => handleNavigate('appointments')}
            className={`sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left font-medium ${
              activeTab === 'appointments' ? 'active' : 'text-gray-700'
            }`}
          >
            <CalendarCheck className="h-5 w-5 flex-shrink-0 text-red-600" />
            <span className="sidebar-text whitespace-nowrap">Appointment Management</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
