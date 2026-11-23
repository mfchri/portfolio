import { z } from 'zod';

/**
 * Strips HTML tags and script content to ensure stored content is safe
 */
export function sanitizeString(val: string): string {
  if (typeof val !== 'string') return val;
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .trim();
}

export const animationSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  typingSpeed: z.enum(['slow', 'normal', 'fast']).default('normal'),
}).default({ enabled: true, typingSpeed: 'normal' });

export const siteMetaSchema = z.object({
  name: z.string().min(1, 'Site name is required'),
  title: z.string().min(1, 'Page title is required'),
  description: z.string().min(1, 'Description is required'),
  keywords: z.string().default(''),
  ogImage: z.string().default('/images/profile-placeholder.png'),
  favicon: z.string().default('/favicon.svg'),
  animations: animationSettingsSchema.optional(),
});

export const navItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  href: z.string().min(1),
});

export const heroStatSchema = z.object({
  value: z.string().min(1, 'Stat value is required'),
  label: z.string().min(1, 'Stat label is required'),
});

export const profileStatementSchema = z.object({
  icon: z.enum(['ShieldCheck', 'Workflow', 'Database', 'Server']),
  text: z.string().min(1, 'Statement text is required'),
});

export const experienceItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  period: z.string().min(1, 'Period is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
  tags: z.array(z.string()).default([]),
});

export const skillCategorySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Category title is required'),
  icon: z.enum(['Shield', 'Cpu', 'Network']),
  description: z.string().min(1, 'Description is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
});

export const contactRowSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
  href: z.string().min(1, 'Link/href is required'),
  isExternal: z.boolean().optional(),
});

export const portfolioContentSchema = z.object({
  site: siteMetaSchema,
  personal: z.object({
    name: z.string().min(1, 'Name is required'),
    title: z.string().min(1, 'Title is required'),
    heroGreeting: z.string().min(1, 'Greeting is required'),
    heroBioDash: z.string().min(1, 'Tagline is required'),
    heroVerticalTop: z.string().default(''),
    heroVerticalBottom: z.string().default(''),
    scrollDownText: z.string().default('Scroll down ↓'),
    profilePhoto: z.object({
      src: z.string().min(1, 'Photo source is required'),
      alt: z.string().default('Profile Photo'),
    }),
    profilePhotoSecondary: z.object({
      src: z.string().min(1, 'Secondary photo source is required'),
      alt: z.string().default('Secondary Photo'),
    }),
  }),
  navigation: z.object({
    logoText: z.string().min(1, 'Logo text is required'),
    links: z.array(navItemSchema),
    ctaText: z.string().min(1, 'CTA text is required'),
    ctaTargetId: z.string().min(1, 'CTA target ID is required'),
  }),
  hero: z.object({
    stats: z.array(heroStatSchema),
    roles: z.array(z.string()).default([]).optional(),
  }),
  profile: z.object({
    sectionLabel: z.string().default('About Me'),
    heading: z.string().min(1, 'Heading is required'),
    paragraph: z.string().min(1, 'Paragraph is required'),
    highlightCard: z.object({
      stat: z.string().min(1, 'Card stat is required'),
      caption: z.string().min(1, 'Card caption is required'),
    }),
    statements: z.array(profileStatementSchema),
  }),
  experience: z.object({
    sectionLabel: z.string().default('Experience'),
    heading: z.string().min(1, 'Heading is required'),
    paragraph: z.string().min(1, 'Paragraph is required'),
    ctaText: z.string().min(1, 'CTA text is required'),
    ctaTargetId: z.string().min(1, 'CTA target ID is required'),
    items: z.array(experienceItemSchema),
  }),
  skills: z.object({
    sectionLabel: z.string().default('Skills'),
    heading: z.string().min(1, 'Heading is required'),
    categories: z.array(skillCategorySchema),
  }),
  contact: z.object({
    sectionLabel: z.string().default('Contact'),
    heading: z.string().min(1, 'Heading is required'),
    invitation: z.string().min(1, 'Invitation is required'),
    emailButtonText: z.string().default('Send Email'),
    emailSubject: z.string().default('Inquiry: IT Infrastructure Governance & Planning'),
    rows: z.array(contactRowSchema),
  }),
  footer: z.object({
    copyrightText: z.string().min(1, 'Copyright is required'),
  }),
});

export const loginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});
