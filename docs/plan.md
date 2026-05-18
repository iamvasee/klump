# Clyra — MVP Implementation Plan

A multi-entity compliance intelligence platform for family offices, promoter groups, and CA/CS firms managing private companies, LLPs, partnerships, and trusts in India.

---

## Tech Stack Decision

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js 15 (App Router, TypeScript) | Full-stack in one repo — SSR, API routes, RSC |
| **UI** | Shadcn/UI + TailwindCSS v4 | Accessible, composable, customizable components |
| **Charts** | Recharts | Lightweight, works well with React/Shadcn |
| **Tables** | TanStack Table v8 | Headless — filtering, sorting, pagination baked in |
| **Database** | Supabase (PostgreSQL) | Managed Postgres + Auth + Storage + RLS in one service |
| **Auth** | Supabase Auth | Email/password, role management via custom claims |
| **File Storage** | Supabase Storage | S3-compatible, integrated with auth, 10MB per file |
| **Deployment** | Vercel | Zero-config Next.js hosting, preview deploys |
| **Package Manager** | pnpm | Faster installs, better monorepo support, avoids peer dep issues |

> [!NOTE]
> Using Supabase as the single backend eliminates the need for a separate Express/FastAPI server for MVP. All data access goes through Supabase client SDK with RLS policies enforcing security at the database level.

---

## User Review Required

> [!IMPORTANT]
> **Supabase Project**: Do you already have a Supabase project set up, or should I scaffold the schema to be applied later? I'll build the app with environment variable placeholders either way.

> [!IMPORTANT]
> **Multi-group support**: For MVP, I'll implement **one Organisation per account**. CA firms managing multiple clients would create separate accounts. This keeps the data model simpler. Is this acceptable?

> [!WARNING]
> **Aadhaar field**: Given regulatory sensitivity (Aadhaar Act), I'll include a **last 4 digits only** field with a clear UI disclaimer. It will be optional. Confirm if you want it excluded entirely.

## Open Questions

1. **MCA CIN auto-fill**: Should I include a basic CIN lookup stub (API route that can be wired up later), or skip entirely for MVP? I'll skip for now but leave the UX placeholder.
2. **Document storage limits**: What's the per-org storage quota? I'll default to **500MB per org** and make it configurable.
3. **Validation approach**: I'll implement **frontend real-time validation** (PAN: `[A-Z]{5}[0-9]{4}[A-Z]`, DIN: 8 digits, CIN: 21 chars, GSTIN: 15 chars) AND backend validation. Both.
4. **Deployment target**: Vercel for frontend. Supabase cloud for backend. Confirm?

---

## Project Structure

```
entity/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Auth routes (login, signup, forgot-password)
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/               # Protected routes
│   │   │   ├── layout.tsx             # Sidebar + Topbar shell
│   │   │   ├── page.tsx               # Dashboard home
│   │   │   ├── entities/
│   │   │   │   ├── page.tsx           # Entity list
│   │   │   │   ├── new/page.tsx       # Add entity form
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx       # Entity detail
│   │   │   │       └── edit/page.tsx  # Edit entity
│   │   │   ├── people/
│   │   │   │   ├── page.tsx           # People list
│   │   │   │   ├── new/page.tsx       # Add person form
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx       # Person detail
│   │   │   │       └── edit/page.tsx  # Edit person
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx           # Account settings
│   │   │   │   ├── users/page.tsx     # User management
│   │   │   │   └── organisation/page.tsx
│   │   │   └── search/page.tsx        # Full search results
│   │   ├── api/                       # API routes (for server-side operations)
│   │   │   ├── entities/route.ts
│   │   │   ├── people/route.ts
│   │   │   ├── relationships/route.ts
│   │   │   ├── documents/route.ts
│   │   │   ├── search/route.ts
│   │   │   └── bulk-import/route.ts
│   │   ├── layout.tsx                 # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                        # Shadcn primitives (auto-generated)
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── topbar.tsx
│   │   │   └── global-search.tsx
│   │   ├── dashboard/
│   │   │   ├── kpi-cards.tsx
│   │   │   ├── entity-type-chart.tsx
│   │   │   ├── recent-activity.tsx
│   │   │   └── onboarding-checklist.tsx
│   │   ├── entities/
│   │   │   ├── entity-form.tsx
│   │   │   ├── entity-table.tsx
│   │   │   ├── entity-detail.tsx
│   │   │   ├── bank-account-section.tsx
│   │   │   ├── gstin-section.tsx
│   │   │   └── entity-columns.tsx
│   │   ├── people/
│   │   │   ├── person-form.tsx
│   │   │   ├── person-table.tsx
│   │   │   ├── person-detail.tsx
│   │   │   └── person-columns.tsx
│   │   ├── relationships/
│   │   │   ├── relationship-form.tsx
│   │   │   ├── associated-people.tsx
│   │   │   └── associated-entities.tsx
│   │   ├── documents/
│   │   │   ├── document-upload.tsx
│   │   │   └── document-list.tsx
│   │   └── shared/
│   │       ├── identifier-badge.tsx
│   │       ├── status-badge.tsx
│   │       ├── completeness-indicator.tsx
│   │       ├── inline-edit.tsx
│   │       └── empty-state.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # Browser client
│   │   │   ├── server.ts              # Server client
│   │   │   └── middleware.ts          # Session refresh
│   │   ├── validations/
│   │   │   ├── pan.ts                 # PAN regex + validation
│   │   │   ├── din.ts
│   │   │   ├── cin.ts
│   │   │   ├── gstin.ts
│   │   │   └── common.ts
│   │   ├── utils.ts                   # cn() + helpers
│   │   ├── constants.ts               # Enums, dropdown options
│   │   └── types.ts                   # TypeScript types for all models
│   ├── hooks/
│   │   ├── use-entities.ts
│   │   ├── use-people.ts
│   │   ├── use-relationships.ts
│   │   ├── use-search.ts
│   │   └── use-user.ts
│   └── middleware.ts                  # Next.js middleware for auth
├── supabase/
│   ├── migrations/
│   │   ├── 001_create_organisations.sql
│   │   ├── 002_create_entities.sql
│   │   ├── 003_create_people.sql
│   │   ├── 004_create_relationships.sql
│   │   ├── 005_create_documents.sql
│   │   ├── 006_create_audit_log.sql
│   │   └── 007_create_rls_policies.sql
│   └── seed.sql                       # Demo data
├── public/
│   └── templates/
│       ├── entity-import-template.xlsx
│       └── people-import-template.xlsx
├── .env.local.example
├── package.json
└── next.config.ts
```

---

## Database Schema

### Core Tables

#### `organisations`
```sql
CREATE TABLE organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `profiles` (extends Supabase auth.users)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `entities`
```sql
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  legal_name TEXT NOT NULL,
  short_name TEXT,
  entity_type TEXT NOT NULL CHECK (entity_type IN (
    'private_limited', 'public_limited', 'llp', 'partnership',
    'trust_private', 'trust_public', 'huf', 'proprietorship'
  )),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
    'active', 'struck_off', 'under_liquidation', 'dormant'
  )),
  date_of_incorporation DATE,
  state_of_incorporation TEXT,
  financial_year_end TEXT DEFAULT 'march_31',
  nature_of_business TEXT,
  -- Identifiers (encrypted at rest by Supabase)
  cin TEXT,
  llpin TEXT,
  pan TEXT,
  tan TEXT,
  iec TEXT,
  udyam TEXT,
  fssai TEXT,
  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  pin_code TEXT,
  email TEXT,
  phone TEXT,
  -- Metadata
  completeness_score INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `entity_gstins` (repeatable)
```sql
CREATE TABLE entity_gstins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  gstin TEXT NOT NULL,
  state TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `entity_bank_accounts` (repeatable)
```sql
CREATE TABLE entity_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  branch TEXT,
  account_number TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  account_type TEXT CHECK (account_type IN ('current', 'savings', 'cc')),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `people`
```sql
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  nationality TEXT DEFAULT 'Indian',
  -- Address
  residential_address TEXT,
  email TEXT,
  phone TEXT,
  -- Identifiers
  pan TEXT,
  aadhaar_last4 TEXT,
  din TEXT,
  dpin TEXT,
  passport_number TEXT,
  dsc_expiry DATE,
  -- Metadata
  completeness_score INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `entity_person_relationships`
```sql
CREATE TABLE entity_person_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN (
    'director', 'managing_director', 'partner', 'designated_partner',
    'trustee', 'shareholder', 'karta', 'proprietor',
    'authorised_signatory', 'beneficial_owner'
  )),
  shareholding_pct DECIMAL(5,2),
  effective_from DATE,
  effective_to DATE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(entity_id, person_id, role)
);
```

#### `documents`
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,       -- Supabase Storage path
  file_size INTEGER,
  mime_type TEXT,
  document_type TEXT NOT NULL CHECK (document_type IN (
    'certificate_of_incorporation', 'llp_agreement', 'pan_card',
    'tan_allotment', 'gst_certificate', 'moa_aoa', 'balance_sheet',
    'itr_acknowledgement', 'bank_statement', 'kyc_document', 'other'
  )),
  description TEXT,
  document_date DATE,
  financial_year TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `audit_log`
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### RLS Policies (applied to every table)
```sql
-- All tables: users can only access data from their own organisation
CREATE POLICY "org_isolation" ON entities
  FOR ALL TO authenticated
  USING (organisation_id = (
    SELECT organisation_id FROM profiles WHERE id = auth.uid()
  ));

-- Viewers cannot INSERT, UPDATE, DELETE
CREATE POLICY "viewer_read_only" ON entities
  FOR SELECT TO authenticated
  USING (true);

-- Editors can INSERT and UPDATE but not DELETE
CREATE POLICY "editor_write" ON entities
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'editor')
  );

-- Only admins can DELETE
CREATE POLICY "admin_delete" ON entities
  FOR DELETE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
```

### Indexes for Search Performance
```sql
-- Full-text search indexes
CREATE INDEX idx_entities_search ON entities USING gin(
  to_tsvector('english', coalesce(legal_name,'') || ' ' || coalesce(pan,'') || ' ' || coalesce(cin,'') || ' ' || coalesce(llpin,''))
);
CREATE INDEX idx_people_search ON people USING gin(
  to_tsvector('english', coalesce(full_name,'') || ' ' || coalesce(pan,'') || ' ' || coalesce(din,'') || ' ' || coalesce(dpin,''))
);

-- Trigram index for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_entities_name_trgm ON entities USING gin(legal_name gin_trgm_ops);
CREATE INDEX idx_people_name_trgm ON people USING gin(full_name gin_trgm_ops);
```

---

## Proposed Changes — Phased Build

### Phase 1: Foundation & Authentication

#### [NEW] Project Scaffold
- Initialize Next.js 15 with TypeScript, TailwindCSS, ESLint
- Install and initialize Shadcn/UI
- Install dependencies: `@supabase/ssr`, `@supabase/supabase-js`, `recharts`, `@tanstack/react-table`, `zod`, `react-hook-form`, `lucide-react`, `date-fns`, `xlsx` (for bulk import)

#### [NEW] Supabase Configuration
- `src/lib/supabase/client.ts` — Browser client
- `src/lib/supabase/server.ts` — Server client
- `src/middleware.ts` — Session refresh middleware

#### [NEW] Auth Pages
- `src/app/(auth)/login/page.tsx` — Email/password login with validation
- `src/app/(auth)/signup/page.tsx` — Signup → creates Organisation + Profile
- `src/app/(auth)/layout.tsx` — Centered auth layout with branding

#### [NEW] Application Shell
- `src/app/(dashboard)/layout.tsx` — Sidebar navigation + Topbar with global search
- `src/components/layout/sidebar.tsx` — Navigation: Dashboard, Entities, People, Settings
- `src/components/layout/topbar.tsx` — Global search bar, user avatar, notification bell placeholder
- `src/components/layout/global-search.tsx` — Command palette style search (⌘K)

---

### Phase 2: Entities Module

#### [NEW] Entity List
- `src/app/(dashboard)/entities/page.tsx` — Server component, fetch entities
- `src/components/entities/entity-table.tsx` — TanStack Table with columns, sorting, pagination
- `src/components/entities/entity-columns.tsx` — Column definitions (name, type, status, PAN, CIN, completeness)
- Filters: Entity type (multi-select), Status, State, Has GSTIN toggle, Incomplete flag

#### [NEW] Add/Edit Entity
- `src/app/(dashboard)/entities/new/page.tsx` — Add entity page
- `src/app/(dashboard)/entities/[id]/edit/page.tsx` — Edit entity page
- `src/components/entities/entity-form.tsx` — React Hook Form + Zod validation
  - Progressive disclosure: Basic Info shown, "Additional Details" collapsible
  - Smart defaults (FY end = March 31, Status = Active)
  - Inline validation for PAN, CIN, GSTIN, TAN formats
  - Repeatable sections: GSTINs, Bank Accounts

#### [NEW] Entity Detail
- `src/app/(dashboard)/entities/[id]/page.tsx` — Entity detail page
- `src/components/entities/entity-detail.tsx` — Read view with inline editing
- Sections: Basic Info | Identifiers | Address | Bank Accounts | Associated People | Documents | Activity Log

---

### Phase 3: People Module

#### [NEW] People List
- `src/app/(dashboard)/people/page.tsx`
- `src/components/people/person-table.tsx`
- `src/components/people/person-columns.tsx`
- Filters: Role, Associated Entity, Has DIN, Incomplete

#### [NEW] Add/Edit Person
- `src/app/(dashboard)/people/new/page.tsx`
- `src/app/(dashboard)/people/[id]/edit/page.tsx`
- `src/components/people/person-form.tsx` — With PAN, DIN, DSC validation

#### [NEW] Person Detail
- `src/app/(dashboard)/people/[id]/page.tsx`
- `src/components/people/person-detail.tsx`
- Mirror of entity detail: Associated Entities (read-only, linked)

---

### Phase 4: Relationships

#### [NEW] Relationship Linking
- `src/components/relationships/relationship-form.tsx` — Modal/dialog to link person ↔ entity
  - Person lookup (search by name/PAN/DIN)
  - Role dropdown, shareholding %, effective dates
  - DIN/DPIN auto-populated from person record
- `src/components/relationships/associated-people.tsx` — Table on entity detail page
- `src/components/relationships/associated-entities.tsx` — Table on person detail page
- Cross-navigation: clickable names navigate to detail pages

---

### Phase 5: Dashboard & Global Search

#### [NEW] Dashboard
- `src/app/(dashboard)/page.tsx`
- `src/components/dashboard/kpi-cards.tsx` — 4 cards: Total Entities, Total People, Total Documents, Incomplete Profiles
- `src/components/dashboard/entity-type-chart.tsx` — Donut chart (Recharts) with entity type breakdown
- `src/components/dashboard/recent-activity.tsx` — Last 10 audit log entries
- `src/components/dashboard/onboarding-checklist.tsx` — Shown when < 3 entities

#### [NEW] Global Search
- `src/components/layout/global-search.tsx` — Command palette (⌘K / Ctrl+K)
  - Debounced (300ms), min 2 chars
  - Searches: Entity Name, PAN, CIN, LLPIN, GSTIN, Person Name, DIN, DPIN
  - Results grouped: Entities | People
  - Uses PostgreSQL full-text search + trigram

---

### Phase 6: Documents & Bulk Import

#### [NEW] Document Management
- `src/components/documents/document-upload.tsx` — Drag & drop, max 10MB, PDF/JPG/PNG
- `src/components/documents/document-list.tsx` — Card grid, filterable by type and FY
- Upload to Supabase Storage → record in `documents` table

#### [NEW] Bulk Import
- `src/app/api/bulk-import/route.ts` — Parse XLSX, validate, return draft records
- `public/templates/entity-import-template.xlsx` — Downloadable template
- UI: Upload → Parse → Review table → Confirm → Create records

---

### Phase 7: Settings, Activity Log & Polish

#### [NEW] Settings Pages
- `src/app/(dashboard)/settings/page.tsx` — Account & billing placeholder
- `src/app/(dashboard)/settings/users/page.tsx` — Invite users, assign roles
- `src/app/(dashboard)/settings/organisation/page.tsx` — Org name, profile

#### [NEW] Activity Log
- Automatic audit logging via Supabase triggers (or API-level logging)
- Activity log component on entity and person detail pages

#### Polish
- Empty states with illustrations
- Loading skeletons (Shadcn Skeleton)
- Toast notifications for CRUD operations
- Keyboard navigation (Tab between fields, Enter to save)
- Responsive design (works on tablet+, not mobile-optimized for MVP)

---

## Design System

### Color Palette
```css
/* Dark theme with deep navy + electric accent */
--background: 222 47% 6%;          /* Deep navy-black */
--foreground: 210 20% 95%;         /* Soft white */
--card: 222 47% 8%;                /* Slightly lighter navy */
--primary: 217 91% 60%;            /* Electric blue */
--primary-foreground: 0 0% 100%;
--secondary: 215 25% 15%;          /* Muted navy */
--accent: 172 66% 50%;             /* Teal accent */
--destructive: 0 84% 60%;          /* Red for errors/delete */
--warning: 38 92% 50%;             /* Amber for incomplete indicators */
--muted: 215 20% 20%;
--border: 215 20% 18%;
```

### Typography
- **Font**: Inter (Google Fonts) — clean, professional, excellent readability
- **Headings**: Semi-bold, tracking-tight
- **Body**: Regular weight, 16px base

### Component Patterns
- **Cards** with subtle glassmorphism (backdrop blur + semi-transparent bg)
- **Tables** with hover rows, sticky headers, alternating row tint
- **Forms** with floating labels, inline validation icons
- **Status badges** with colored dots (green=active, amber=incomplete, red=struck off)
- **Micro-animations**: 150ms transitions on hover, slide-in for panels, fade for modals

---

## Verification Plan

### Automated Tests
```bash
# Build verification
pnpm build            # Ensure zero build errors

# Lint and type check
pnpm lint
pnpm tsc --noEmit

# Dev server smoke test
pnpm dev              # Verify app starts on localhost:3000
```

### Browser Verification (using browser tool)
1. **Auth flow**: Signup → Login → Redirect to dashboard
2. **Entity CRUD**: Create entity → Verify in list → View detail → Edit → Delete
3. **People CRUD**: Same flow for people
4. **Relationships**: Link person to entity → Verify appears on both sides → Cross-navigate
5. **Search**: Search by name, PAN, CIN → Verify results
6. **Dashboard**: Verify KPI cards reflect actual data counts
7. **Documents**: Upload file → Verify appears in document list
8. **Responsive**: Test at 1440px, 1024px, 768px widths

### Manual Verification
- User to verify Supabase project connection
- User to test with real entity data for validation accuracy
- User to confirm design aesthetics match expectations

---

## Estimated Build Time

| Phase | Estimated Duration |
|---|---|
| Phase 1: Foundation & Auth | ~2 hours |
| Phase 2: Entities Module | ~3 hours |
| Phase 3: People Module | ~2 hours |
| Phase 4: Relationships | ~1.5 hours |
| Phase 5: Dashboard & Search | ~2 hours |
| Phase 6: Documents & Bulk Import | ~2 hours |
| Phase 7: Settings, Audit, Polish | ~1.5 hours |
| **Total** | **~14 hours** |

> [!TIP]
> I'll build this iteratively — each phase will produce a working, runnable app. You can review and course-correct at each checkpoint.
\n### Professionals Module
- **Listing Page**: Added `/professionals` to view all individuals acting as Statutory Auditors or Company Secretaries.
- **Detail View**: Added `/professionals/[uid]` to show their specific profile and associated entities.
