import { PortfolioContent } from '../../shared/types';

/**
 * =====================================================================
 * DEFAULT / FALLBACK PORTFOLIO CONTENT
 * =====================================================================
 * Used as the baseline on first run to seed server/data/content.json,
 * and as an offline fallback if the backend API is unreachable.
 */
export const defaultContent: PortfolioContent = {
  site: {
    name: "Alex Morgan Portfolio",
    title: "Alex Morgan | IT Infrastructure Governance & Planning",
    description: "Portfolio of an IT Infrastructure Governance & Planning professional specializing in enterprise architecture, ITIL/COBIT compliance, capacity planning, and cloud governance.",
    keywords: "IT Infrastructure, Governance, Planning, ITIL, COBIT, TOGAF, ISO 27001, Enterprise Architecture, Capacity Planning",
    ogImage: "/images/profile-placeholder.png",
    favicon: "/favicon.svg",
    animations: {
      enabled: true,
      typingSpeed: "normal",
    },
  },

  personal: {
    name: "Alex Morgan",
    title: "IT Infrastructure Governance & Planning",
    heroGreeting: "Hello",
    heroBioDash: "— I'm Alex Morgan, an IT Infrastructure Governance & Planning professional specializing in resilient enterprise architectures.",
    heroVerticalTop: "IT Infrastructure Governance & Planning",
    heroVerticalBottom: "2026",
    scrollDownText: "Scroll down ↓",
    profilePhoto: {
      src: "/images/profile-placeholder.png",
      alt: "Alex Morgan - IT Infrastructure Governance & Planning Professional",
    },
    profilePhotoSecondary: {
      src: "/images/profile-placeholder-2.jpg",
      alt: "Alex Morgan - Portrait in About Section",
    },
  },

  navigation: {
    logoText: "Alex Morgan",
    links: [
      { id: "home", label: "Home", href: "#home" },
      { id: "profile", label: "Profile", href: "#profile" },
      { id: "experience", label: "Experience", href: "#experience" },
      { id: "skills", label: "Skills", href: "#skills" },
      { id: "contact", label: "Contact", href: "#contact" },
    ],
    ctaText: "Get in Touch ↗",
    ctaTargetId: "contact",
  },

  hero: {
    stats: [
      {
        value: "10+",
        label: "Years Experience",
      },
      {
        value: "50+",
        label: "Projects Delivered",
      },
    ],
    roles: [
      "IT Infrastructure Governance & Planning",
      "Enterprise Architecture (TOGAF)",
      "Cloud & Hybrid-Cloud Governance",
      "Disaster Recovery & BCP Strategy",
    ],
  },

  profile: {
    sectionLabel: "About Me",
    heading: "Bridging strategy and enterprise resilience.",
    paragraph:
      "I oversee enterprise technology foundations, orchestrating compliant, high-availability infrastructure across hybrid-cloud and data center environments. By harmonizing ITIL, COBIT, and TOGAF frameworks with strategic budgeting, I help technology leadership mitigate downtime and eliminate systemic operational risks.",
    highlightCard: {
      stat: "99.9%",
      caption: "Average infrastructure uptime across managed enterprise environments and critical banking cores.",
    },
    statements: [
      {
        icon: "ShieldCheck",
        text: "Leading enterprise risk governance, ISO 27001 regulatory audits, and Architecture Review Boards.",
      },
      {
        icon: "Workflow",
        text: "Formulating 3-to-5-year infrastructure modernization roadmaps, BCP/DR strategies, and FinOps frameworks.",
      },
    ],
  },

  experience: {
    sectionLabel: "Experience",
    heading: "Explore My Professional Journey",
    paragraph:
      "A decade of leading multi-cloud governance, mission-critical capacity modeling, and enterprise infrastructure compliance.",
    ctaText: "Get in Touch ↗",
    ctaTargetId: "contact",
    items: [
      {
        id: "exp-1",
        title: "IT Infrastructure Governance Manager",
        company: "Apex Enterprise Solutions",
        period: "Feb 2022 — Present",
        location: "New York, NY",
        description:
          "Direct enterprise infrastructure policies and chaired the CAB/ARB across 14 global business units. Reduced configuration drift by 42% through automated compliance gates.",
        tags: ["Governance", "COBIT 2019", "ISO 27001", "ARB"],
      },
      {
        id: "exp-2",
        title: "IT Infrastructure Planning Lead",
        company: "Vanguard Financial Group",
        period: "Jan 2018 — Jan 2022",
        location: "Boston, MA",
        description:
          "Spearheaded long-range capacity forecasting and BCP/DR architecture for high-frequency transactional cores, boosting disaster recovery RTO by 60%.",
        tags: ["Capacity Planning", "TOGAF", "BCP/DR", "FinOps"],
      },
      {
        id: "exp-3",
        title: "Senior Infrastructure Analyst",
        company: "Horizon Health Systems",
        period: "Jun 2014 — Dec 2017",
        location: "Philadelphia, PA",
        description:
          "Evaluated data center virtualization density, storage tiers, and network topologies under strict HIPAA standards, authoring comprehensive ITIL SOPs.",
        tags: ["ITIL v4", "Virtualization", "HIPAA", "Telemetry"],
      },
    ],
  },

  skills: {
    sectionLabel: "Skills",
    heading: "Tools & Expertise",
    categories: [
      {
        id: "skill-1",
        title: "Governance & Compliance",
        icon: "Shield",
        description: "Frameworks, risk models, and regulatory alignment ensuring zero critical audit deviations.",
        skills: [
          "ITIL Framework",
          "COBIT 2019",
          "ISO 27001",
          "Risk Management",
          "Policy & Standards",
          "CAB / Change Governance",
          "SLA & OLA Architecture",
        ],
      },
      {
        id: "skill-2",
        title: "Infrastructure Planning",
        icon: "Cpu",
        description: "Forecasting workload demands, enterprise blueprints, and business continuity architecture.",
        skills: [
          "Capacity Planning",
          "IT Strategic Roadmap",
          "Enterprise Arch (TOGAF)",
          "Disaster Recovery & BCP",
          "CapEx / OpEx Budgeting",
          "Cloud Migration Strategy",
          "FinOps & Cost Control",
        ],
      },
      {
        id: "skill-3",
        title: "Technical & Tools",
        icon: "Network",
        description: "Hands-on mastery of enterprise virtualization, network resiliency, and observability platforms.",
        skills: [
          "Cloud (AWS / Azure / GCP)",
          "Virtualization (VMware)",
          "Enterprise Networking",
          "Monitoring & Telemetry",
          "Vendor & RFP Governance",
          "ServiceNow / CMDB",
          "High Availability Systems",
        ],
      },
    ],
  },

  contact: {
    sectionLabel: "Contact",
    heading: "Let's Work Together",
    invitation:
      "Available for leadership roles, advisory consultations, and enterprise infrastructure governance initiatives. Inquire directly or connect across professional channels.",
    emailButtonText: "Send Email",
    emailSubject: "Inquiry: IT Infrastructure Governance & Planning",
    rows: [
      {
        label: "Email",
        value: "alex.morgan.governance@example.com",
        href: "mailto:alex.morgan.governance@example.com?subject=Inquiry:%20IT%20Infrastructure%20Governance%20%26%20Planning",
        isExternal: false,
      },
      {
        label: "Phone",
        value: "+1 (555) 234-5678",
        href: "tel:+15552345678",
        isExternal: false,
      },
      {
        label: "Location",
        value: "New York, NY / Hybrid & Remote",
        href: "#contact",
        isExternal: false,
      },
      {
        label: "LinkedIn",
        value: "linkedin.com/in/alex-morgan-it",
        href: "https://linkedin.com/in/alex-morgan-it",
        isExternal: true,
      },
      {
        label: "GitHub",
        value: "github.com/alex-morgan-infra",
        href: "https://github.com/alex-morgan-infra",
        isExternal: true,
      },
    ],
  },

  footer: {
    copyrightText: "© 2026 Alex Morgan. All rights reserved.",
  },
};

// Also export as content for backwards compatibility
export const content = defaultContent;
export default defaultContent;
