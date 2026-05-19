-- Migration: Multi-Tenant Organisation Membership & RLS
-- This migration:
-- 1. Fixes the users table to decouple users from a single organisation
-- 2. Creates the organisation_members junction table for multi-org membership
-- 3. Adds created_by audit columns pointing to auth.users (Supabase native)
-- 4. Enables Row Level Security on all data tables
-- 5. Creates RLS policies so users only see their organisation's data

-- ============================================================
-- STEP 1: Fix the users table
-- Drop the hard-wired organisation_id column from users.
-- A user can belong to MANY organisations via organisation_members.
-- ============================================================
ALTER TABLE users DROP COLUMN IF EXISTS organisation_id;
ALTER TABLE users DROP COLUMN IF EXISTS role;

-- Link our users profile table to Supabase auth.users
-- This ensures every auth user can have a profile row.
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);


-- ============================================================
-- STEP 2: Create the organisation_members table
-- This is the single source of truth for who can access what.
-- ============================================================
CREATE TABLE IF NOT EXISTS organisation_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'viewer',
    invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- A user can only have one role per organisation
    UNIQUE(organisation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_members_org ON organisation_members(organisation_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON organisation_members(user_id);


-- ============================================================
-- STEP 3: Fix created_by to reference auth.users, not custom users
-- The audit trail points to who in Supabase Auth made the change.
-- ============================================================
ALTER TABLE entities
    DROP COLUMN IF EXISTS created_by,
    ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add created_by to other key tables for full audit trail
ALTER TABLE people
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE filings
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE documents
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;


-- ============================================================
-- STEP 4: Enable Row Level Security on ALL data tables
-- Without this, any authenticated user can see all data.
-- ============================================================
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE equity_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE director_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trustee_appointments ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- STEP 5: Helper function to get current user's org IDs
-- This is used in RLS policies to avoid subquery repetition.
-- ============================================================
CREATE OR REPLACE FUNCTION get_my_org_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT organisation_id
    FROM organisation_members
    WHERE user_id = auth.uid();
$$;


-- ============================================================
-- STEP 6: RLS Policies — Organisations
-- Users can only see orgs they are a member of.
-- ============================================================
CREATE POLICY "Members can view their organisations"
    ON organisations FOR SELECT
    USING (id IN (SELECT get_my_org_ids()));

CREATE POLICY "Admins can update their organisation"
    ON organisations FOR UPDATE
    USING (
        id IN (
            SELECT organisation_id FROM organisation_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );


-- ============================================================
-- STEP 7: RLS Policies — Organisation Members
-- Members can see who else is in their org.
-- Only admins can invite/remove members.
-- ============================================================
CREATE POLICY "Members can view org membership"
    ON organisation_members FOR SELECT
    USING (organisation_id IN (SELECT get_my_org_ids()));

CREATE POLICY "Admins can manage org membership"
    ON organisation_members FOR ALL
    USING (
        organisation_id IN (
            SELECT organisation_id FROM organisation_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );


-- ============================================================
-- STEP 8: RLS Policies — Core Data Tables
-- All data is scoped to the user's organisation memberships.
-- Editors and admins can write. Viewers are read-only.
-- ============================================================

-- Entities
CREATE POLICY "Org members can view entities"
    ON entities FOR SELECT
    USING (organisation_id IN (SELECT get_my_org_ids()));

CREATE POLICY "Editors and admins can insert entities"
    ON entities FOR INSERT
    WITH CHECK (
        organisation_id IN (
            SELECT organisation_id FROM organisation_members
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Editors and admins can update entities"
    ON entities FOR UPDATE
    USING (
        organisation_id IN (
            SELECT organisation_id FROM organisation_members
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admins can delete entities"
    ON entities FOR DELETE
    USING (
        organisation_id IN (
            SELECT organisation_id FROM organisation_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- People
CREATE POLICY "Org members can view people"
    ON people FOR SELECT
    USING (organisation_id IN (SELECT get_my_org_ids()));

CREATE POLICY "Editors and admins can manage people"
    ON people FOR ALL
    USING (
        organisation_id IN (
            SELECT organisation_id FROM organisation_members
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Bank Accounts (scoped via entity's org)
CREATE POLICY "Org members can view bank accounts"
    ON bank_accounts FOR SELECT
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE organisation_id IN (SELECT get_my_org_ids())
        )
    );

CREATE POLICY "Editors and admins can manage bank accounts"
    ON bank_accounts FOR ALL
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE organisation_id IN (
                SELECT organisation_id FROM organisation_members
                WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );

-- Filings
CREATE POLICY "Org members can view filings"
    ON filings FOR SELECT
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE organisation_id IN (SELECT get_my_org_ids())
        )
    );

CREATE POLICY "Editors and admins can manage filings"
    ON filings FOR ALL
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE organisation_id IN (
                SELECT organisation_id FROM organisation_members
                WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );

-- Documents
CREATE POLICY "Org members can view documents"
    ON documents FOR SELECT
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE organisation_id IN (SELECT get_my_org_ids())
        )
    );

CREATE POLICY "Editors and admins can manage documents"
    ON documents FOR ALL
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE organisation_id IN (
                SELECT organisation_id FROM organisation_members
                WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );

-- Share Classes & Equity Ledger
CREATE POLICY "Org members can view share classes"
    ON share_classes FOR SELECT
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE organisation_id IN (SELECT get_my_org_ids())
        )
    );

CREATE POLICY "Editors and admins can manage share classes"
    ON share_classes FOR ALL
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE organisation_id IN (
                SELECT organisation_id FROM organisation_members
                WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );

CREATE POLICY "Org members can view equity ledger"
    ON equity_ledger FOR SELECT
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE organisation_id IN (SELECT get_my_org_ids())
        )
    );

CREATE POLICY "Editors and admins can manage equity ledger"
    ON equity_ledger FOR ALL
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE organisation_id IN (
                SELECT organisation_id FROM organisation_members
                WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );

-- Appointment Tables
CREATE POLICY "Org members can view director appointments"
    ON director_appointments FOR SELECT
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE organisation_id IN (SELECT get_my_org_ids())
        )
    );

CREATE POLICY "Editors and admins can manage director appointments"
    ON director_appointments FOR ALL
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE organisation_id IN (
                SELECT organisation_id FROM organisation_members
                WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );

CREATE POLICY "Org members can view partner appointments"
    ON partner_appointments FOR SELECT
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE organisation_id IN (SELECT get_my_org_ids())
        )
    );

CREATE POLICY "Editors and admins can manage partner appointments"
    ON partner_appointments FOR ALL
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE organisation_id IN (
                SELECT organisation_id FROM organisation_members
                WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );

CREATE POLICY "Org members can view trustee appointments"
    ON trustee_appointments FOR SELECT
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE organisation_id IN (SELECT get_my_org_ids())
        )
    );

CREATE POLICY "Editors and admins can manage trustee appointments"
    ON trustee_appointments FOR ALL
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE organisation_id IN (
                SELECT organisation_id FROM organisation_members
                WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );
