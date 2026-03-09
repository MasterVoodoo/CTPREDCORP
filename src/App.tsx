import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AdminLayout } from '@/components/layout/AdminLayout';

import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import ContactPage from '@/pages/ContactPage';
import PropertiesPage from '@/pages/PropertiesPage';
import BuildingPage from '@/pages/BuildingPage';
import UnitDetailsPage from '@/pages/UnitDetailsPage';
import AllAvailableSpacesPage from '@/pages/AllAvailableSpacesPage';
import ScheduleAppointmentPage from '@/pages/ScheduleAppointmentPage';
import SearchResultsPage from '@/pages/SearchResultsPage';
import TenantPortalPage from '@/pages/TenantPortalPage';

import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';

import BoardOfDirectorsPage from '@/pages/sustainability/BoardOfDirectorsPage';
import ManagementTeamPage from '@/pages/sustainability/ManagementTeamPage';
import PoliciesProceduresPage from '@/pages/sustainability/PoliciesProceduresPage';
import CompliancePage from '@/pages/sustainability/CompliancePage';
import InvestorRelationsPage from '@/pages/sustainability/InvestorRelationsPage';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="properties/:buildingId" element={<BuildingPage />} />
        <Route path="units/:unitId" element={<UnitDetailsPage />} />
        <Route path="spaces" element={<AllAvailableSpacesPage />} />
        <Route path="schedule" element={<ScheduleAppointmentPage />} />
        <Route path="search" element={<SearchResultsPage />} />
        <Route path="tenant-portal" element={<TenantPortalPage />} />
        
        {/* Sustainability Routes */}
        <Route path="sustainability/board-of-directors" element={<BoardOfDirectorsPage />} />
        <Route path="sustainability/management-team" element={<ManagementTeamPage />} />
        <Route path="sustainability/policies" element={<PoliciesProceduresPage />} />
        <Route path="sustainability/compliance" element={<CompliancePage />} />
        <Route path="sustainability/investor-relations" element={<InvestorRelationsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
      </Route>
    </Routes>
  );
}
