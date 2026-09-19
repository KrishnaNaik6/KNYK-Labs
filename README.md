# KNYK Labs — Official Public Website

The production-ready public website for **KNYK Labs** (`KrishnaNaik6/KNYK-Labs`), a digital solutions and software engineering studio.

> [!NOTE]
> This repository contains the **PUBLIC website only**. All business data, service catalogs, portfolio projects, client testimonials, brand assets, contact information, and website settings are dynamically supplied by **NEXIS**, which serves as the central headless CMS and backend control center.

---

## 1. Project Purpose

KNYK Labs delivers modern software engineering, web application development, visual brand identity, digital media production, and custom AI agent automation. The public website showcases the agency's capabilities, transparent milestone-based pricing, and recent work while providing a high-conversion enquiry funnel and direct communication channels.

---

## 2. Architecture

```
Visitor Browser
      │
      ▼
KNYK Labs Website (Next.js 16 App Router)
  ├── Server Components (SSR / ISR)
  ├── Dynamic Metadata & OpenGraph
  ├── Dynamic Sitemap & Robots
  └── Resilient Fallbacks (WhatsApp / Phone / Email)
      │
      ▼ Server-to-Server
NEXIS Public Gateway (Frozen Contract)
      │
      ▼
NEXIS Database & CMS Control Hub
```

Detailed architectural blueprints are available in [docs/architecture.md](docs/architecture.md).

---

## 3. NEXIS API Dependency & Frozen Contract

KNYK Labs communicates exclusively with the public, sanitized endpoints exposed by NEXIS.

### Frozen Public Endpoints:
- `GET /api/v1/knyk/services` — Full service catalog & categories
- `GET /api/v1/knyk/contact` & `GET /api/v1/knyk/business` — Centralized contact, address, hours, and social channels
- `GET /api/v1/knyk/branding` — Dynamic logo variants, favicon, and brandmark assets
- `GET /api/v1/knyk/portfolio` — Project showcase entries, tech stacks, and case studies
- `GET /api/v1/knyk/testimonials` — Verified client reviews and star ratings
- `GET /api/v1/knyk/website` — SEO metadata, maintenance mode flag, and announcement banner
- `POST /api/v1/knyk/enquiries` — Public client enquiry submission (`no-store`)

Complete endpoint documentation and caching rules are available in [docs/nexis-integration.md](docs/nexis-integration.md).

---

## 4. Environment Variables

Create `.env.local` using `.env.example`:

```bash
cp .env.example .env.local
```

### Required Configuration:

```env
# NEXIS API URL (Server-side, single source of truth)
NEXIS_API_URL=https://your-nexis-api-domain.com

# Cache Revalidation TTL (optional, defaults to 60s)
NEXIS_REVALIDATE_SECONDS=60

# Public Canonical Site URL (for SEO / Sitemap / OpenGraph)
NEXT_PUBLIC_SITE_URL=https://knyklabs.com
```

> [!IMPORTANT]
> Never commit secrets or private credentials to this repository. KNYK Labs does not require database credentials or Supabase service-role keys.

---

## 5. Local Development

### Prerequisites:
- Node.js 20+
- npm 10+

### Installation:

```bash
npm install
```

### Start Dev Server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 6. Testing

The repository includes a comprehensive behavioral test suite using **Vitest** and **Testing Library**:

```bash
npm run test
```

### Test Coverage Areas:
- **API Response Parsing**: Normalizing flat/nested catalogs, handling empty arrays and missing optional fields.
- **Enquiry Form Validation**: Email regex, name lengths, and message length constraints.
- **Enquiry Submission**: Successful lead dispatch, 429 rate limit alerts, 503 maintenance alerts, and `no-store` cache verification.
- **Component Rendering**: Service cards, portfolio highlights, testimonials, announcement banners, and empty states.
- **SEO & Search Engines**: Dynamic `robots.txt` behavior and `sitemap.xml` URL generation.

---

## 7. Production Build & Quality Verification

Run all production quality checks:

```bash
# 1. TypeScript Strict Type Check
npx tsc --noEmit

# 2. ESLint
npm run lint

# 3. Automated Test Suite
npm run test

# 4. Production Next.js Build
npm run build

# 5. Start Production Server
npm run start
```

---

## 8. Deployment

This Next.js application is optimized for deployment on Vercel, Netlify, Docker, or any Node.js hosting environment:

1. Connect the GitHub repository `KrishnaNaik6/KNYK-Labs`.
2. Add Environment Variables:
   - `NEXIS_API_URL`: Points to your live NEXIS API instance.
   - `NEXT_PUBLIC_SITE_URL`: Your production domain (e.g., `https://knyklabs.com`).
3. Build Command: `npm run build`
4. Output Directory: Default (`.next`)

---

## 9. License

Private repository © KNYK Labs. All rights reserved.
