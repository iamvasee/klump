# Klump — Backend Plan (Deferred)

> [!NOTE]
> This file contains all backend-related specifications extracted from the main plan. These will be implemented **after** the frontend is complete.

---

## Tech Stack (Backend)

| Layer            | Choice                | Rationale                                              |
| ---------------- | --------------------- | ------------------------------------------------------ |
| **Database**     | Supabase (PostgreSQL) | Managed Postgres + Auth + Storage + RLS in one service |
| **Auth**         | Supabase Auth         | Email/password, role management via custom claims      |
| **File Storage** | Supabase Storage      | S3-compatible, integrated with auth, 10MB per file     |

> [!NOTE]
> Using Supabase as the single backend eliminates the need for a separate Express/FastAPI server for MVP. All data access goes through Supabase client SDK with RLS policies enforcing security at the database level.

---

## Open Questions (Backend)

1. **Supabase Project**: Do you already have a Supabase project set up, or should I scaffold the schema to be applied later?
2. **Multi-group support**: For MVP — one Organisation per account. CA firms managing multiple clients would create separate accounts. Confirm?
3. **Document storage limits**: What's the per-org storage quota? Default: **500MB per org**.
4. **Aadhaar field**: Last 4 digits only with UI disclaimer, or exclude entirely?
5. **MCA CIN auto-fill**: Skip for MVP but leave a UX stub?
6. **Deployment target**: Vercel for frontend. Supabase cloud for backend. Confirm?

---

## API Routes

These will live under `src/app/api/` when backend is wired up:

```
src/app/api/
├── entities/route.ts
├── people/route.ts
├── relationships/route.ts
├── documents/route.ts
├── search/route.ts
└── bulk-import/route.ts
```

---

## Supabase Configuration Files

```
src/lib/supabase/
├── client.ts              # Browser client
├── server.ts              # Server client
└── middleware.ts           # Session refresh
```

```
supabase/
├── migrations/
│   ├── 001_create_organisations.sql
│   ├── 002_create_entities.sql
│   ├── 003_create_people.sql
│   ├── 004_create_relationships.sql
│   ├── 005_create_documents.sql
│   ├── 006_create_audit_log.sql
│   └── 007_create_rls_policies.sql
└── seed.sql                       # Demo data
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

## Backend Verification Plan

### When Backend is Implemented

1. **Auth flow**: Signup → Login → Redirect to dashboard
2. **RLS**: Verify org isolation — User A cannot see User B's data
3. **Role enforcement**: Viewer cannot create/edit, Editor cannot delete
4. **Search**: Full-text search across entities and people
5. **Document upload**: Upload to Supabase Storage, record in DB
6. **Audit log**: Every CRUD operation logged with before/after values
7. **Bulk import**: Parse XLSX → validate → create draft records
