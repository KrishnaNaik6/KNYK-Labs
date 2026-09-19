# NEXIS Integration & Frozen API Contract

## 1. Overview

KNYK Labs is completely powered by the **NEXIS Control Center**. All business information, catalog data, portfolio entries, testimonials, branding assets, and global website configurations are fetched from the frozen NEXIS public endpoints.

## 2. Environment Configuration

The integration requires a single server-side environment variable:

```env
NEXIS_API_URL=https://your-nexis-api-domain.com
```

- **Security Rule**: Never prefix `NEXIS_API_URL` with `NEXT_PUBLIC_` unless deliberately consuming public edge endpoints without credentials.
- **Secrets**: KNYK Labs does NOT hold or require any Supabase service-role keys, database passwords, or admin tokens.

## 3. Frozen Public API Endpoints

All responses from NEXIS public endpoints strictly adhere to the standard envelope format:

### Success Envelope
```json
{
  "success": true,
  "data": T,
  "timestamp": "2026-09-19T12:00:00.000Z"
}
```

### Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": null
  },
  "timestamp": "2026-09-19T12:00:00.000Z"
}
```

---

### Endpoint Reference & Cache Strategy

| Endpoint | Method | Purpose | Client Module | Cache Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/knyk/services` | `GET` | Service categories & services | `lib/api/services.ts` | 1 min browser / 5 min CDN |
| `/api/v1/knyk/contact` | `GET` | Centralized business & contact | `lib/api/contact.ts` | 5 min browser / 30 min CDN |
| `/api/v1/knyk/business` | `GET` | Business details alias | `lib/api/contact.ts` | 5 min browser / 30 min CDN |
| `/api/v1/knyk/branding` | `GET` | Dynamic logos & marks | `lib/api/branding.ts` | 1 hour browser / 24 hour CDN |
| `/api/v1/knyk/portfolio` | `GET` | Projects & case studies | `lib/api/portfolio.ts` | 2 min browser / 10 min CDN |
| `/api/v1/knyk/testimonials` | `GET` | Client ratings & quotes | `lib/api/testimonials.ts` | 5 min browser / 30 min CDN |
| `/api/v1/knyk/website` | `GET` | SEO & site settings | `lib/api/website.ts` | 2 min browser / 10 min CDN |
| `/api/v1/knyk/enquiries` | `POST` | Public lead submission | `lib/api/enquiries.ts` | strictly `no-store` |

---

## 4. Endpoint Schemas & Mapping

### 4.1 Services (`GET /api/v1/knyk/services`)

**Category Fields**:
- `id`: string
- `name`: string
- `slug`: string
- `description`: string | null
- `icon`: string | null
- `displayOrder`: number
- `services`: KnykPublicService[]

**Service Fields**:
- `id`: string
- `categoryId`: string
- `categoryName`: string
- `categorySlug`: string
- `name`: string
- `slug`: string
- `shortDescription`: string | null
- `description`: string | null
- `startingPrice`: number | null
- `currency`: string
- `advancePercentage`: number
- `estimatedDelivery`: string | null
- `imageUrl`: string | null
- `isFeatured`: boolean
- `displayOrder`: number

*Internal fields such as `is_enabled`, `status`, `created_at`, `updated_at` are stripped by NEXIS and not exposed.*

---

### 4.2 Contact (`GET /api/v1/knyk/contact`)

**Fields**:
- `businessName`: string
- `email`: string | null
- `supportEmail`: string | null
- `salesEmail`: string | null
- `phone`: string | null
- `whatsappNumber`: string | null
- `address`: `{ line, city, state, country, postalCode }` | null
- `businessHours`: string | null
- `googleMapsUrl`: string | null
- `websiteUrl`: string | null
- `social`: `{ instagram, facebook, linkedin, github, youtube }` | null

---

### 4.3 Branding (`GET /api/v1/knyk/branding`)

**Fields**:
- `primaryLogo`: `{ url, alt, width, height }` | null
- `brandMark`: `{ url, alt, width, height }` | null
- `favicon`: `{ url, alt }` | null
- `socialPreview`: `{ url, alt }` | null
- `lightLogo`: `{ url, alt }` | null
- `darkLogo`: `{ url, alt }` | null

---

### 4.4 Portfolio (`GET /api/v1/knyk/portfolio`)

**Fields**:
- `id`: string
- `title`: string
- `slug`: string
- `category`: string
- `summary`: string
- `description`: string | null
- `tags`: string[]
- `coverImageUrl`: string | null
- `galleryUrls`: string[]
- `technologies`: string[]
- `projectUrl`: string | null
- `isFeatured`: boolean
- `displayOrder`: number

---

### 4.5 Testimonials (`GET /api/v1/knyk/testimonials`)

**Fields**:
- `id`: string
- `name`: string
- `role`: string
- `company`: string
- `content`: string
- `avatarUrl`: string | null
- `rating`: number
- `isFeatured`: boolean
- `displayOrder`: number

---

### 4.6 Website Settings & SEO (`GET /api/v1/knyk/website`)

**Fields**:
- `siteTitle`: string
- `siteDescription`: string
- `keywords`: string[]
- `canonicalUrl`: string | null
- `ogTitle`: string | null
- `ogDescription`: string | null
- `ogImageUrl`: string | null
- `robotsBehavior`: string ("index, follow" or "noindex, nofollow")
- `maintenanceMode`: boolean
- `announcementBanner`: string | null
- `announcementLink`: string | null
- `footerDescription`: string | null
- `copyrightText`: string | null

---

### 4.7 Enquiries (`POST /api/v1/knyk/enquiries`)

**Request Payload**:
```json
{
  "name": "Jane Founder",
  "email": "jane@startup.com",
  "phone": "+91 98765 43210",
  "whatsapp": "+91 98765 43210",
  "serviceId": "srv-web",
  "budget": "₹50,000 - ₹1,00,000",
  "message": "We would like to consult on an MVP build.",
  "source": "website_contact_form"
}
```

**Success Response**:
```json
{
  "success": true,
  "data": {
    "message": "Thank you for reaching out. Our team will contact you shortly."
  },
  "timestamp": "2026-09-19T12:00:00.000Z"
}
```

**Important Integration Rules for Enquiries**:
1. Never expect or render a `leadId` or `id`.
2. 429 Too Many Requests: Returns a user-friendly rate-limit warning.
3. 503 Service Unavailable: Returns scheduled maintenance notice with direct WhatsApp/phone fallback.
4. Form button is disabled during submission to prevent duplicate leads.
5. Strictly `cache: "no-store"`.
