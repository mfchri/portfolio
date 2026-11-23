# IT Infrastructure Governance & Planning Portfolio + CMS

An editorial-style single-page portfolio website designed for an **IT Infrastructure Governance & Planning** professional, featuring an integrated, zero-database **Content Management System (CMS)** with a password-protected admin dashboard at `/admin`, combined with fluid **Typewriter & Framer Motion** scroll animations.

---

## ⚡ Quick Start (One Command)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Both Frontend and Backend
```bash
npm run dev
```
This single command runs `concurrently`:
- **Vite Frontend**: [http://localhost:5173/](http://localhost:5173/)
- **Express CMS Backend**: [http://localhost:3001/](http://localhost:3001/)
- Vite automatically proxies `/api` and `/uploads` requests to the backend.

---

## ✨ Animations & Motion Architecture

The public portfolio features smooth, accessible animations:

### 1. Hero Typewriter Effect (`src/hooks/useTypewriter.ts` & `src/components/Typewriter.tsx`)
- **Page Load Sequence**: Starts after a brief `300ms` delay:
  1. The monumental **"Hello"** headline types out letter-by-letter (`120ms/char`), followed by a blinking cursor.
  2. The bio tagline below it types out (`40ms/char`).
  3. Once typing finishes, the highlight metrics, vertical margin labels, and "Scroll down ↓" indicator fade in softly (`0.8s`). The portrait photo fades in simultaneously at page start so the section is never visually empty.
- **Rotating Roles**: The professional title can rotate through a list of roles (`hero.roles`), typing, pausing for `2s`, backspacing, and typing the next role. If only one role is configured, it renders statically with no backspacing.
- **Zero Layout Shift (CLS = 0)**: Invisible ghost text reserves the full container dimensions in the DOM before and during animation.
- **Screen Reader Accessible**: Full text is embedded with `aria-label` on semantic headings, with animated spans set to `aria-hidden="true"`.

### 2. Scroll-Triggered Fade-In Animations (`src/components/motion/`)
- Powered by `framer-motion` using `<FadeIn>` and `<Stagger>` wrappers:
  - **Profile / About**: The "About Me" column slides in from the left, the white uptime card slides up from below, and the right column slides in from the right. The two governance statements stagger one after another.
  - **Experience**: Heading and label fade up, followed by the 3 job rows with a `0.15s` stagger. Thin divider lines expand horizontally (`scaleX: 0 → 1`).
  - **Skills**: The 3 competency cards fade up with a `0.15s` stagger, and individual skill badge chips stagger in with a `0.04s` interval.
  - **Contact**: Monumental display heading fades up, followed by contact rows with a `0.1s` stagger, the primary email button, and the pinned footer.

### 3. Tuning Speeds & Delays
All animation constants are centralized in:
📁 **`src/config/animation.ts`**
- Adjust `initialDelay`, `charSpeedGreeting`, `charSpeedBio`, `rolePauseTime`, and `cursorHideAfter`.
- Scroll animation parameters (`viewportAmount`, `defaultDuration`, `staggerDelay`).

### 4. Admin Toggle & Accessibility
- **Admin Control**: Go to `/admin/site` to toggle animations on/off and switch typing speed between **Slow**, **Normal**, and **Fast**.
- **Reduced Motion**: Automatically respects `prefers-reduced-motion: reduce`. When active or toggled off, all content renders statically and instantly with zero delays or blinking cursors.

---

## 🔐 Administrator Login & Initial Credentials

- **Admin Login URL**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Default Password**: `admin12345` *(defined in `.env` as `ADMIN_PASSWORD`)*

> [!IMPORTANT]
> Once logged in, navigate to **Settings** (`/admin/settings`) to change your admin password. The password is cryptographically hashed with `bcrypt` and stored in `server/data/admin.json`.

---

## 🎛️ CMS Features & Admin Sections

The admin dashboard shares the same minimalist, monochrome editorial styling as the portfolio:

| Section | Route | Description |
|---|---|---|
| **Dashboard** | `/admin` | Quick status overview, section shortcuts, and live site link |
| **Site & SEO** | `/admin/site` | Page title, meta description, keywords, Open Graph image, favicon, **Animation controls** |
| **Hero** | `/admin/hero` | Name, title, "Hello" headline, bio tagline, **rotating roles chips**, top-left metrics, vertical labels, portrait cutout upload |
| **Profile & About** | `/admin/profile` | Bio paragraph, uptime highlight card stat & caption, 2 governance statements with icon pickers, secondary portrait upload |
| **Experience** | `/admin/experience` | Reorderable timeline (drag-and-drop or arrow buttons), positions, companies, dates ("Present" toggle), bullet descriptions, framework chips |
| **Skills & Tools** | `/admin/skills` | Competency groups (add/remove/reorder), icon picker (`Shield`, `Cpu`, `Network`), description, tag chips |
| **Contact** | `/admin/contact` | Display headline, invitation statement, primary mailto button, email subject, channel rows |
| **Media Library** | `/admin/media` | Browse all uploaded images, preview, copy URL, and delete with in-use safety warnings |
| **Backups** | `/admin/backups` | View last 20 automatic timestamped snapshots with one-click restore |
| **Settings** | `/admin/settings` | Update admin password, reset content to factory defaults |

---

## 🏗️ Architecture & Storage

```
├── server/
│   ├── index.ts              # Express API server & static uploads provider
│   ├── routes/               # API endpoints (/auth, /content, /upload, /backups)
│   ├── middleware/           # JWT cookie auth & error handling
│   ├── lib/storage.ts        # Atomic JSON writer, auto-backups & media management
│   ├── data/                 # Persistent storage (auto-created, gitignored)
│   │   ├── content.json      # Primary content database
│   │   ├── admin.json        # Hashed administrator credentials
│   │   └── backups/          # Timestamped backups (last 20 retained)
│   └── uploads/              # Uploaded images (gitignored)
├── shared/
│   ├── types.ts              # Shared TypeScript interfaces (frontend + backend)
│   └── schema.ts             # Zod validation schemas & HTML sanitizers
├── src/
│   ├── admin/                # Admin Panel SPA (/admin)
│   ├── components/           # Public portfolio components (full-screen sections)
│   │   ├── motion/           # FadeIn and Stagger framer-motion components
│   │   └── Typewriter.tsx    # Layout-reserved typewriter UI
│   ├── config/               # animation.ts (centralized animation constants)
│   ├── context/              # ContentProvider with dynamic SEO
│   ├── hooks/                # useTypewriter.ts
│   └── data/content.ts       # Baseline default & fallback content
├── .env.example              # Environment variables template
├── package.json              # Scripts: dev, build, start
└── vite.config.ts            # Vite proxy & vendor code-splitting configuration
```

---

## 💾 Backing Up Your Data

To backup your content and media, simply archive these two directories:
- `server/data/`: contains `content.json`, `admin.json`, and all historical snapshots in `backups/`.
- `server/uploads/`: contains all uploaded images.

---

## 🚀 Production Deployment

Because content and uploaded images are saved as files on disk, your production host requires a **persistent disk or volume**:

```bash
# 1. Build client and TypeScript
npm run build

# 2. Start Express server (serves both API and production frontend)
npm start
```
