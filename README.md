# KNYK Labs — Official Public Website

The official public-facing website for **KNYK Labs** (`KrishnaNaik6/KNYK-Labs`), a digital solutions studio delivering modern software engineering, visual brand identity, media production, presentations, and intelligent automation systems.

## Core Architecture

```
Visitor  ──►  KNYK Labs Website (Next.js App Router)  ──►  NEXIS Public API  ──►  NEXIS Database
```

- **NEXIS Control Center Integration**: The website dynamically consumes public catalog APIs from NEXIS (`GET /api/v1/knyk/services`).
- **Zero Admin / Zero Secrets**: No private keys, database credentials, or admin endpoints are committed or exposed to the browser.
- **Resilient Fallback**: If NEXIS is unreachable or unconfigured during build or runtime, the application never crashes and displays graceful fallbacks with working WhatsApp, Call, and Email channels.

## Tech Stack

- **Framework**: Next.js (App Router, Server Components & Client Components)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 with curated dark-first theme, glassmorphism, and cyan/teal accents
- **Icons**: Lucide React
- **Linting**: ESLint

## Getting Started

### 1. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your environment variables:

```env
# NEXIS API Configuration (Server-side, single source of truth)
NEXIS_API_URL=https://nexis-api.example.com
NEXIS_REVALIDATE_SECONDS=60

# Site URL for Canonical & OpenGraph
NEXT_PUBLIC_SITE_URL=https://knyklabs.com
```

### 2. Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript type check
npx tsc --noEmit

# Run ESLint
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

## Route Map

- `/` — Landing Page (Hero, Featured Services, Dynamic Category Services, Why KNYK Labs, Capabilities Highlight, 4-Phase Process, Client Commitments, CTA)
- `/services` — Full Dynamic Catalog with category filtering, search, pricing, and turnaround estimates
- `/services/[slug]` — Dynamic Service Detail with SEO metadata, milestone payment terms, and WhatsApp/Call actions
- `/portfolio` — Selected Work Showcase (prepared for NEXIS portfolio module with elegant coming-soon state)
- `/about` — Authentic studio narrative, guiding principles, and modern tech stack
- `/contact` — Client scoping gateway with form validation and direct WhatsApp/Phone/Email actions
- `/robots.txt` & `/sitemap.xml` — Dynamic search engine indexing

## License

Private repository © KNYK Labs. All rights reserved.
