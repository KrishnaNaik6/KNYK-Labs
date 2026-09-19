# KNYK Labs Website Architecture

## 1. System Overview

KNYK Labs is the public web presentation layer for the KNYK Labs digital engineering, branding, media, and AI automation studio.

```
                          ┌──────────────────────────┐
                          │   Visitor Web Browser    │
                          └────────────┬─────────────┘
                                       │ HTTPS
                                       ▼
                     ┌───────────────────────────────────┐
                     │    Next.js 16 (App Router)        │
                     │  - Server Components (SSR/ISR)    │
                     │  - Dynamic Metadata & Sitemap     │
                     │  - Edge-Ready Route Handlers      │
                     └─────────────────┬─────────────────┘
                                       │
                      Server-to-Server │ GET /api/v1/knyk/*
                         Public APIs   │ POST /api/v1/knyk/enquiries
                                       ▼
                     ┌───────────────────────────────────┐
                     │        NEXIS Public Gateway       │
                     │    (Frozen Public API Contract)   │
                     └─────────────────┬─────────────────┘
                                       │
                                       ▼
                     ┌───────────────────────────────────┐
                     │  NEXIS Database & CMS Control Hub │
                     └───────────────────────────────────┘
```

## 2. Guiding Architectural Principles

1. **NEXIS as the Single Source of Truth**:
   - Services, categories, portfolio projects, testimonials, branding assets, business contacts, and SEO settings are managed exclusively in NEXIS.
   - Zero duplication of CMS or operational records in KNYK-Labs.
   - Zero hardcoded business info, pricing, or asset URLs.

2. **Zero Internal/Admin Leakage**:
   - No administrative endpoints, service-role keys, database passwords, or CRM internals (such as lead IDs, CRM statuses, or admin notes) are stored in this repository or exposed to the browser.
   - All internal fields (`is_enabled`, `status`, `created_at`, `updated_at`) are excluded from public DTOs.

3. **Hybrid Performance & Caching Strategy**:
   - Public pages use Next.js App Router Server Components with Incremental Static Regeneration (ISR) and strict revalidation matching the NEXIS Cache-Control policy:
     - Branding: 1 hour browser / 24 hours CDN (`revalidate: 3600`)
     - Services: 1 minute browser / 5 minutes CDN (`revalidate: 60`)
     - Contact & Business: 5 minutes browser / 30 minutes CDN (`revalidate: 300`)
     - Testimonials: 5 minutes browser / 30 minutes CDN (`revalidate: 300`)
     - Portfolio: 2 minutes browser / 10 minutes CDN (`revalidate: 120`)
     - Website & SEO: 2 minutes browser / 10 minutes CDN (`revalidate: 120`)
     - Enquiries: strictly `no-store` (`cache: "no-store"`)

4. **Resilient Degradation**:
   - If NEXIS is temporarily offline (503) or undergoing upgrades, the application handles it gracefully without 500 runtime crashes:
     - Catalog components show fallback guidance and direct WhatsApp/Phone/Email connect channels.
     - Global maintenance mode renders a dedicated high-tech maintenance screen if `website.maintenanceMode === true`.
     - Enquiry submission catches rate limits (429), maintenance (503), and network timeouts with friendly user alerts and double-submission prevention.

## 3. Directory Layout

```
KNYK-Labs/
├── __tests__/                   # Vitest unit & behavioral tests
│   ├── api-parsing.test.ts      # Frozen DTO parsing & normalization tests
│   ├── components-rendering.test.tsx # UI component rendering & resilience tests
│   ├── enquiry-submission.test.ts    # Enquiry dispatch, 429, 503, no-store tests
│   ├── enquiry-validation.test.ts    # Client-side input validation tests
│   └── seo-metadata.test.ts     # Dynamic robots.txt & sitemap.xml tests
├── app/                         # Next.js App Router
│   ├── about/                   # About page
│   ├── api/                     # Server Route Handlers
│   │   └── enquiries/route.ts   # POST /api/enquiries (forwards to NEXIS)
│   ├── contact/                 # Contact & enquiry form page
│   ├── portfolio/               # Portfolio showcase grid
│   │   └── [slug]/              # Individual portfolio case study page
│   ├── services/                # Services catalog page with search & filter
│   │   └── [slug]/              # Individual service detail page
│   ├── layout.tsx               # Root layout (Metadata, WebsiteContext, Banner, Maintenance)
│   ├── page.tsx                 # Home landing page
│   ├── robots.ts                # Dynamic robots.txt generator
│   └── sitemap.ts               # Dynamic sitemap.xml generator
├── components/
│   ├── contact/                 # Contact details & interactive enquiry form
│   ├── home/                    # Home-specific section components
│   ├── layout/                  # Navbar, Footer, AnnouncementBanner, MaintenanceScreen
│   ├── portfolio/               # Portfolio cards, grid, gallery
│   ├── sections/                # Reusable landing sections (Hero, FeaturedWork, etc.)
│   ├── services/                # Service cards, filterable grids
│   └── ui/                      # Base atomic components (Button, Badge, Card, etc.)
├── docs/                        # Architecture & integration specifications
│   ├── architecture.md
│   └── nexis-integration.md
├── lib/
│   ├── api/                     # Strongly typed public NEXIS API client layer
│   │   ├── branding.ts          # GET /api/v1/knyk/branding
│   │   ├── contact.ts           # GET /api/v1/knyk/contact & business
│   │   ├── enquiries.ts         # POST /api/v1/knyk/enquiries
│   │   ├── index.ts             # Central API barrel export
│   │   ├── nexis.ts             # Core fetcher with timeout & error handling
│   │   ├── portfolio.ts         # GET /api/v1/knyk/portfolio
│   │   ├── services.ts          # GET /api/v1/knyk/services
│   │   ├── testimonials.ts      # GET /api/v1/knyk/testimonials
│   │   └── website.ts           # GET /api/v1/knyk/website
│   ├── context/                 # React contexts (WebsiteContext)
│   ├── types/
│   │   └── knyk.ts              # Frozen NEXIS Public DTO interfaces
│   └── utils/                   # Formatting & link builders (currency, contact)
```
