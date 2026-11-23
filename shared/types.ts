/**
 * =====================================================================
 * SHARED DATA CONTRACTS (FRONTEND & BACKEND)
 * =====================================================================
 */

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface ProfileStatement {
  icon: 'ShieldCheck' | 'Workflow' | 'Database' | 'Server';
  text: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  tags: string[];
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: 'Shield' | 'Cpu' | 'Network';
  description: string;
  skills: string[];
}

export interface ContactRow {
  label: string;
  value: string;
  href: string;
  isExternal?: boolean;
}

export interface AnimationSettings {
  enabled: boolean;
  typingSpeed: 'slow' | 'normal' | 'fast';
}

export interface SiteMeta {
  name: string;
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  favicon: string;
  animations?: AnimationSettings;
}

export interface PortfolioContent {
  site: SiteMeta;
  personal: {
    name: string;
    title: string;
    heroGreeting: string;
    heroBioDash: string;
    heroVerticalTop: string;
    heroVerticalBottom: string;
    scrollDownText: string;
    profilePhoto: {
      src: string;
      alt: string;
    };
    profilePhotoSecondary: {
      src: string;
      alt: string;
    };
  };
  navigation: {
    logoText: string;
    links: NavItem[];
    ctaText: string;
    ctaTargetId: string;
  };
  hero: {
    stats: HeroStat[];
    roles?: string[];
  };
  profile: {
    sectionLabel: string;
    heading: string;
    paragraph: string;
    highlightCard: {
      stat: string;
      caption: string;
    };
    statements: ProfileStatement[];
  };
  experience: {
    sectionLabel: string;
    heading: string;
    paragraph: string;
    ctaText: string;
    ctaTargetId: string;
    items: ExperienceItem[];
  };
  skills: {
    sectionLabel: string;
    heading: string;
    categories: SkillCategory[];
  };
  contact: {
    sectionLabel: string;
    heading: string;
    invitation: string;
    emailButtonText: string;
    emailSubject: string;
    rows: ContactRow[];
  };
  footer: {
    copyrightText: string;
  };
}

export interface BackupItem {
  id: string;
  timestamp: string;
  filename: string;
  size: number;
}

export interface MediaItem {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
  isUsed: boolean;
}

export interface AuthResponse {
  authenticated: boolean;
  message?: string;
}
