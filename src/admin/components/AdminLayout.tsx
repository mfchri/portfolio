import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe,
  Sparkles,
  User,
  Briefcase,
  Wrench,
  Mail,
  Image as ImageIcon,
  History,
  Settings,
  LogOut,
  ExternalLink,
  Save,
  Eye,
  EyeOff,
  Menu,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { useAdminAuth } from '../hooks/useAdminAuth';

export const AdminLayout: React.FC = () => {
  const { draft, isDirty, isSaving, saveChanges, toast, clearToast, showPreview, togglePreview, previewKey } = useAdmin();
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to log out?')) {
        return;
      }
    }
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/site', label: 'Site & SEO', icon: Globe },
    { to: '/admin/hero', label: 'Hero Section', icon: Sparkles },
    { to: '/admin/profile', label: 'Profile & About', icon: User },
    { to: '/admin/experience', label: 'Experience', icon: Briefcase },
    { to: '/admin/skills', label: 'Skills & Tools', icon: Wrench },
    { to: '/admin/contact', label: 'Contact Details', icon: Mail },
    { to: '/admin/media', label: 'Media Library', icon: ImageIcon },
    { to: '/admin/backups', label: 'Backups', icon: History },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-page flex flex-col font-sans text-primary">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-page/90 backdrop-blur-md border-b border-border px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="lg:hidden p-2 rounded-lg text-primary hover:bg-page-alt"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-sm sm:text-base font-semibold tracking-tight text-primary">
                CMS Admin
              </span>
              <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-page-alt border border-border text-secondary font-medium">
                v0.2.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Preview Toggle (Desktop only) */}
            <button
              type="button"
              onClick={togglePreview}
              className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                showPreview
                  ? 'bg-primary text-white border-primary'
                  : 'bg-page-alt border-border text-secondary hover:text-primary'
              }`}
            >
              {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPreview ? 'Hide Preview' : 'Live Preview'}</span>
            </button>

            {/* View public website link */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-secondary hover:text-primary transition-colors px-2 py-1"
            >
              <span>View Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Unsaved indicator & Save button */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1.5 text-xs">
                {isDirty ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-amber-700 font-medium">Unsaved</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-secondary font-medium">Saved</span>
                  </>
                )}
              </span>

              <button
                type="button"
                onClick={saveChanges}
                disabled={isSaving || !isDirty}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                  isDirty
                    ? 'bg-primary text-white hover:opacity-90 cursor-pointer'
                    : 'bg-panel-muted text-secondary opacity-60 cursor-not-allowed'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-secondary hover:text-red-600 transition-colors rounded-lg hover:bg-page-alt"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content + Optional Live Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-page p-4 space-y-1 shrink-0">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-secondary">
            Content Sections
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white font-semibold shadow-xs'
                      : 'text-secondary hover:text-primary hover:bg-page-alt'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-6 mt-auto border-t border-border px-3 text-xs text-secondary">
            <p className="font-medium text-primary">{draft.personal?.name || 'Administrator'}</p>
            <p className="text-[11px] truncate">{draft.site?.title || 'Portfolio CMS'}</p>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-72 h-full bg-page border-r border-border p-4 flex flex-col space-y-1 shadow-xl animate-in slide-in-from-left duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-border mb-2">
                <span className="font-semibold text-sm">Navigation</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-secondary hover:text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-white font-semibold'
                          : 'text-secondary hover:text-primary hover:bg-page-alt'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}

        {/* Center Main Editor View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl">
          <Outlet />
        </main>

        {/* Right Collapsible Live Preview Panel (Desktop only) */}
        {showPreview && (
          <aside className="hidden lg:flex w-[480px] xl:w-[580px] border-l border-border bg-page flex-col shrink-0">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-page-alt">
              <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Live Preview
              </span>
              <button
                type="button"
                onClick={togglePreview}
                className="text-xs text-secondary hover:text-primary"
              >
                Close ✕
              </button>
            </div>
            <div className="flex-1 relative bg-white">
              <iframe
                key={previewKey}
                src="/?preview=true"
                title="Portfolio Live Preview"
                className="w-full h-full border-none"
              />
            </div>
          </aside>
        )}
      </div>

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all animate-in fade-in slide-in-from-bottom-2 duration-150 bg-white border-border text-primary">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={clearToast}
            className="ml-2 text-secondary hover:text-primary"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
