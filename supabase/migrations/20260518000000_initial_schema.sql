-- Initial Schema for Entity Management Application

-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Core Infrastructure
CREATE TABLE organisations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'viewer',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE entity_type AS ENUM (
    'private_limited',
    'public_limited',
    'llp',
    'partnership',
    'trust_private',
    'trust_public',
    'huf',
    'proprietorship'
);

CREATE TYPE entity_status AS ENUM (
    'active',
    'struck_off',
    'under_liquidation',
    'dormant'
);

CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    legal_name TEXT NOT NULL,
    short_name TEXT,
    entity_type entity_type NOT NULL,
    status entity_status DEFAULT 'active',
    date_of_incorporation DATE,
    state_of_incorporation TEXT,
    financial_year_end TEXT DEFAULT 'march_31',
    nature_of_business TEXT,
    pan TEXT,
    tan TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    pin_code TEXT,
    email TEXT,
    phone TEXT,
    completeness_score INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb, -- Holds CIN, LLPIN, FSSAI, etc.
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    nationality TEXT,
    pan TEXT,
    email TEXT,
    phone TEXT,
    completeness_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Operational Data
CREATE TYPE account_type AS ENUM ('current', 'savings', 'cc');

CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    account_holder_name TEXT NOT NULL,
    branch TEXT,
    account_number TEXT NOT NULL,
    ifsc_code TEXT NOT NULL,
    account_type account_type DEFAULT 'current',
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE filings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    filing_type TEXT NOT NULL,
    financial_year TEXT,
    filing_date DATE,
    status TEXT DEFAULT 'pending',
    description TEXT,
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    filing_id UUID REFERENCES filings(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    document_type TEXT NOT NULL,
    document_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Capital & Event Sourcing
CREATE TYPE share_class_type AS ENUM ('equity', 'preference', 'ccps', 'ocps');

CREATE TABLE share_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type share_class_type NOT NULL,
    nominal_value DECIMAL(12, 2) NOT NULL,
    total_authorised NUMERIC DEFAULT 0,
    total_issued NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE equity_transaction_type AS ENUM (
    'issuance',
    'transfer',
    'buyback',
    'bonus',
    'split',
    'merger'
);

CREATE TABLE equity_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    share_class_id UUID REFERENCES share_classes(id) ON DELETE CASCADE,
    transaction_type equity_transaction_type NOT NULL,
    from_stakeholder_id UUID, -- Null if issuance
    from_stakeholder_type TEXT, -- 'person' or 'entity'
    to_stakeholder_id UUID, -- Null if buyback
    to_stakeholder_type TEXT, -- 'person' or 'entity'
    share_count NUMERIC NOT NULL,
    effective_date DATE NOT NULL,
    filing_id UUID REFERENCES filings(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Management & Appointments (Junction Tables)
CREATE TABLE director_appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    person_id UUID REFERENCES people(id) ON DELETE CASCADE,
    din TEXT,
    designation TEXT, -- e.g., Managing Director, Additional Director
    start_date DATE NOT NULL,
    end_date DATE,
    appointment_filing_id UUID REFERENCES filings(id) ON DELETE SET NULL,
    resignation_filing_id UUID REFERENCES filings(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE partner_appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    person_id UUID, -- Either person...
    related_entity_id UUID, -- ...or another entity acting as a partner
    capital_contribution DECIMAL(15, 2) DEFAULT 0,
    profit_sharing_ratio DECIMAL(5, 2) DEFAULT 0, -- e.g., 50.00
    designation TEXT, -- e.g., Designated Partner, Sleeping Partner
    start_date DATE NOT NULL,
    end_date DATE,
    appointment_filing_id UUID REFERENCES filings(id) ON DELETE SET NULL,
    resignation_filing_id UUID REFERENCES filings(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (person_id IS NOT NULL OR related_entity_id IS NOT NULL)
);

CREATE TABLE trustee_appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    person_id UUID REFERENCES people(id) ON DELETE CASCADE,
    appointment_type TEXT, -- e.g., Managing Trustee, Settlor
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Indexes for Performance
CREATE INDEX idx_entities_org ON entities(organisation_id);
CREATE INDEX idx_entities_type ON entities(entity_type);
CREATE INDEX idx_entities_metadata_cin ON entities USING GIN ((metadata->'cin'));
CREATE INDEX idx_filings_entity ON filings(entity_id);
CREATE INDEX idx_equity_ledger_entity ON equity_ledger(entity_id);
CREATE INDEX idx_director_entity ON director_appointments(entity_id);
CREATE INDEX idx_partner_entity ON partner_appointments(entity_id);
