# FitTracker — CalAI‑style Fitness App

A modern, responsive fitness tracker built with React + TypeScript + Vite. The app follows a clean pages/layouts/components architecture, includes animated UX with Framer Motion, and provides authentication pages (Login and Register) alongside a marketing hero page.

## ✨ Features
- Hero landing page (no gradients), responsive across devices
- Auth pages: Login and Register with validation, password toggle, social buttons
- Split `AuthLayout` with marketing copy on the left and form on the right
- Global `MainLayout` with responsive `Navbar`, working mobile hamburger menu and slide-in drawer, and `Footer`
- Reusable UI primitives: `Button`, `Input`, `Card`
- Framer Motion animations (page transitions, hover/tap, staggered reveals)
- Tailwind CSS v4 design tokens and dark-ready palette

## 🧱 Project Structure
```
src/
├── assets/
├── components/
│   ├── forms/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── ui/
│   │   ├── Button.tsx         // cva-based button variants
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx             // desktop + mobile hamburger
│   └── MobileMenu.tsx         // slide-in drawer for mobile
├── layouts/
│   ├── AuthLayout.tsx         // split-screen auth layout
│   └── MainLayout.tsx         // top-level layout with transitions
├── pages/
│   ├── HeroPage.tsx           // marketing page
│   ├── LoginPage.tsx          // wraps LoginForm
│   └── RegisterPage.tsx       // wraps SignupForm
├── lib/
│   └── utils.ts               // utility helpers (cn, etc.)
├── types/
│   └── index.ts               // User, LoginCredentials, RegisterData, etc.
├── App.tsx                    // routes + layouts
├── index.css                  // Tailwind v4 setup and theme tokens
└── main.tsx                   // app bootstrap
```

## 🛠 Tech Stack
- React 19 + TypeScript
- Vite 7
- React Router 7
- Tailwind CSS v4 (with `@tailwindcss/vite`)
- class-variance-authority + tailwind-merge
- Lucide React (icons)
- Framer Motion 12 (animations)
- ESLint 9 (TypeScript, React hooks)

## 🧭 Routing
- `/` — Hero page inside `MainLayout`
- `/login` — Login inside `AuthLayout`
- `/register` — Register inside `AuthLayout`
- `/dashboard` — Placeholder inside `MainLayout`

Routing is declared in `src/App.tsx` using `Routes` and `Route` with layout composition.

## 🎨 UI/UX Principles
- No gradients, clean solid backgrounds
- Mobile-first responsive design
- Accessible form labels, focus-visible rings
- Animations:
  - Page transitions in `MainLayout`
  - Staggered reveals and hover/tap effects in `HeroPage`
  - Slide-in mobile drawer in `MobileMenu`
  - Subtle micro-interactions on buttons and icons

## ▶️ Getting Started

### Prerequisites
- Node.js ≥ 18
- pnpm, npm, or yarn

### Install
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```
Vite will print a local URL (typically http://localhost:5173). 

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## 🔐 Forms & Validation
- Client-side validation for email format and required fields
- Password visibility toggles
- Register flow validates password length and match
- Social buttons are UI stubs (integrate your OAuth provider as needed)

## 📱 Mobile Navigation
- Hamburger button (top-right) opens a sliding drawer (`MobileMenu`)
- Backdrop click closes the drawer; body scroll is locked while open
- Drawer items auto-close on navigation

## 🧩 Styling
- Tailwind v4 utility-first styling
- Design tokens defined in `index.css` (background, foreground, primary, etc.)
- Components keep consistent spacing/typography; dark-mode ready tokens

## 🧪 Testing Ideas (not included)
- Component tests for `Button`, `Input`, and forms (Vitest + Testing Library)
- E2E smoke tests for routes (Playwright)

## 🚀 Deployment
- Any static host: Vercel, Netlify, Cloudflare Pages, GitHub Pages
- Build output: `dist/`

## 🗺 Roadmap (suggested)
- Hook up real auth (Supabase/Auth.js/Firebase)
- Persist user profile and metrics
- Dashboard with charts and AI insights
- PWA support (offline + installable)

## 📄 License
MIT — use, modify, and distribute freely.

---
Made with ❤️ using React, Tailwind, and Framer Motion.
