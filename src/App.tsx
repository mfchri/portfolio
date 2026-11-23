import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import { PublicPortfolio } from './PublicPortfolio';
import { LoginPage } from './admin/pages/LoginPage';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { AdminProvider } from './admin/AdminContext';
import { AdminLayout } from './admin/components/AdminLayout';
import { DashboardPage } from './admin/pages/DashboardPage';
import { SitePage } from './admin/pages/SitePage';
import { HeroPage } from './admin/pages/HeroPage';
import { ProfilePage } from './admin/pages/ProfilePage';
import { ExperiencePage } from './admin/pages/ExperiencePage';
import { SkillsPage } from './admin/pages/SkillsPage';
import { ContactPage } from './admin/pages/ContactPage';
import { MediaPage } from './admin/pages/MediaPage';
import { BackupsPage } from './admin/pages/BackupsPage';
import { SettingsPage } from './admin/pages/SettingsPage';

export function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website (Single Page at /) */}
          <Route path="/" element={<PublicPortfolio />} />

          {/* Admin Login Route */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminProvider>
                <ProtectedRoute />
              </AdminProvider>
            }
          >
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="site" element={<SitePage />} />
              <Route path="hero" element={<HeroPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="experience" element={<ExperiencePage />} />
              <Route path="skills" element={<SkillsPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="media" element={<MediaPage />} />
              <Route path="backups" element={<BackupsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Fallback to Public Site */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}

export default App;
