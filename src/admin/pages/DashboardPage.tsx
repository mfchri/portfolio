import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Sparkles,
  User,
  Briefcase,
  Wrench,
  Mail,
  Image as ImageIcon,
  History,
  Settings,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';

export const DashboardPage: React.FC = () => {
  const { draft, isDirty } = useAdmin();

  const sections = [
    {
      title: 'Site & SEO',
      desc: 'Site metadata, page title, favicon & OG tags',
      to: '/admin/site',
      icon: Globe,
      status: draft.site?.title ? 'Configured' : 'Needs attention',
    },
    {
      title: 'Hero Section',
      desc: 'Name, greeting headline, portrait cutout, stats',
      to: '/admin/hero',
      icon: Sparkles,
      status: `${draft.hero?.stats?.length || 0} stats`,
    },
    {
      title: 'Profile & About',
      desc: 'Bio paragraph, uptime card stat, 2 governance statements',
      to: '/admin/profile',
      icon: User,
      status: 'Ready',
    },
    {
      title: 'Experience',
      desc: 'Career timeline, roles, dates, achievements & tags',
      to: '/admin/experience',
      icon: Briefcase,
      status: `${draft.experience?.items?.length || 0} positions`,
    },
    {
      title: 'Skills & Tools',
      desc: 'Categorized competency cards and chip tags',
      to: '/admin/skills',
      icon: Wrench,
      status: `${draft.skills?.categories?.length || 0} categories`,
    },
    {
      title: 'Contact Details',
      desc: 'Email, phone, location, LinkedIn, GitHub links',
      to: '/admin/contact',
      icon: Mail,
      status: `${draft.contact?.rows?.length || 0} channels`,
    },
    {
      title: 'Media Library',
      desc: 'Uploaded portraits, backgrounds, and images',
      to: '/admin/media',
      icon: ImageIcon,
      status: 'Manage files',
    },
    {
      title: 'Backups',
      desc: 'Automatic snapshots and one-click restores',
      to: '/admin/backups',
      icon: History,
      status: 'Version control',
    },
    {
      title: 'Settings',
      desc: 'Change admin password and reset content',
      to: '/admin/settings',
      icon: Settings,
      status: 'Security',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-card rounded-card-lg border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Portfolio CMS Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Welcome back, {draft.personal?.name || 'Administrator'}
          </h1>
          <p className="text-sm text-secondary max-w-xl">
            Edit your portfolio content, upload media, reorder experiences, and manage site settings in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-page hover:bg-page-alt text-xs font-semibold text-primary transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Unsaved notification if any */}
      {isDirty && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-amber-900 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>You have unsaved changes. Remember to click "Save Changes" in the top bar.</span>
          </div>
        </div>
      )}

      {/* Grid of Sections */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-secondary">
          Manage Website Sections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <Link
                key={sec.to}
                to={sec.to}
                className="group p-5 rounded-card bg-card border border-border hover:border-primary/40 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-page-alt flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-medium text-secondary bg-page px-2 py-0.5 rounded-full border border-border">
                      {sec.status}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-primary group-hover:text-primary transition-colors">
                    {sec.title}
                  </h3>
                  <p className="mt-1 text-xs text-secondary leading-relaxed">
                    {sec.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-medium text-secondary group-hover:text-primary transition-colors">
                  <span>Edit section</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
