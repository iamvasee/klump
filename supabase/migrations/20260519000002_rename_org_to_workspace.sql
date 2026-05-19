-- Migration: Rename 'organisation' to 'workspace' across the database
-- 
-- Renames the tenant structure from 'organisations' to 'workspaces' to prevent
-- naming collisions with the business entities managed inside the application.

-- 1. Rename tables
ALTER TABLE organisations RENAME TO workspaces;
ALTER TABLE organisation_members RENAME TO workspace_members;

-- 2. Rename columns
ALTER TABLE entities RENAME COLUMN organisation_id TO workspace_id;
ALTER TABLE people RENAME COLUMN organisation_id TO workspace_id;
ALTER TABLE workspace_members RENAME COLUMN organisation_id TO workspace_id;

-- 3. Rename indexes
ALTER INDEX IF EXISTS idx_entities_org RENAME TO idx_entities_workspace;
ALTER INDEX IF EXISTS idx_org_members_org RENAME TO idx_workspace_members_workspace;
ALTER INDEX IF EXISTS idx_org_members_user RENAME TO idx_workspace_members_user;
ALTER INDEX IF EXISTS organisations_slug_key RENAME TO workspaces_slug_key;
ALTER INDEX IF EXISTS organisation_members_organisation_id_user_id_key RENAME TO workspace_members_workspace_id_user_id_key;

-- 4. Replace the helper function
DROP FUNCTION IF EXISTS get_my_org_ids() CASCADE;

CREATE OR REPLACE FUNCTION get_my_workspace_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT workspace_id
    FROM workspace_members
    WHERE user_id = auth.uid();
$$;

-- 5. Drop old policies
DROP POLICY IF EXISTS "Members can view their organisations" ON workspaces;
DROP POLICY IF EXISTS "Admins can update their organisation" ON workspaces;
DROP POLICY IF EXISTS "Members can view org membership" ON workspace_members;
DROP POLICY IF EXISTS "Admins can manage org membership" ON workspace_members;
DROP POLICY IF EXISTS "Org members can view entities" ON entities;
DROP POLICY IF EXISTS "Editors and admins can insert entities" ON entities;
DROP POLICY IF EXISTS "Editors and admins can update entities" ON entities;
DROP POLICY IF EXISTS "Admins can delete entities" ON entities;
DROP POLICY IF EXISTS "Org members can view people" ON people;
DROP POLICY IF EXISTS "Editors and admins can manage people" ON people;
DROP POLICY IF EXISTS "Org members can view bank accounts" ON bank_accounts;
DROP POLICY IF EXISTS "Editors and admins can manage bank accounts" ON bank_accounts;
DROP POLICY IF EXISTS "Org members can view filings" ON filings;
DROP POLICY IF EXISTS "Editors and admins can manage filings" ON filings;
DROP POLICY IF EXISTS "Org members can view documents" ON documents;
DROP POLICY IF EXISTS "Editors and admins can manage documents" ON documents;
DROP POLICY IF EXISTS "Org members can view share classes" ON share_classes;
DROP POLICY IF EXISTS "Editors and admins can manage share classes" ON share_classes;
DROP POLICY IF EXISTS "Org members can view equity ledger" ON equity_ledger;
DROP POLICY IF EXISTS "Editors and admins can manage equity ledger" ON equity_ledger;
DROP POLICY IF EXISTS "Org members can view director appointments" ON director_appointments;
DROP POLICY IF EXISTS "Editors and admins can manage director appointments" ON director_appointments;
DROP POLICY IF EXISTS "Org members can view partner appointments" ON partner_appointments;
DROP POLICY IF EXISTS "Editors and admins can manage partner appointments" ON partner_appointments;
DROP POLICY IF EXISTS "Org members can view trustee appointments" ON trustee_appointments;
DROP POLICY IF EXISTS "Editors and admins can manage trustee appointments" ON trustee_appointments;

-- 6. Recreate Policies with workspace_id and get_my_workspace_ids()

-- Workspaces
CREATE POLICY "Members can view their workspaces"
    ON workspaces FOR SELECT
    USING (id IN (SELECT get_my_workspace_ids()));

CREATE POLICY "Admins can update their workspace"
    ON workspaces FOR UPDATE
    USING (
        id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Workspace Members
CREATE POLICY "Members can view workspace membership"
    ON workspace_members FOR SELECT
    USING (workspace_id IN (SELECT get_my_workspace_ids()));

CREATE POLICY "Admins can manage workspace membership"
    ON workspace_members FOR ALL
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Entities
CREATE POLICY "Workspace members can view entities"
    ON entities FOR SELECT
    USING (workspace_id IN (SELECT get_my_workspace_ids()));

CREATE POLICY "Editors and admins can insert entities"
    ON entities FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Editors and admins can update entities"
    ON entities FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admins can delete entities"
    ON entities FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- People
CREATE POLICY "Workspace members can view people"
    ON people FOR SELECT
    USING (workspace_id IN (SELECT get_my_workspace_ids()));

CREATE POLICY "Editors and admins can manage people"
    ON people FOR ALL
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Bank Accounts
CREATE POLICY "Workspace members can view bank accounts"
    ON bank_accounts FOR SELECT
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE workspace_id IN (SELECT get_my_workspace_ids())
        )
    );

CREATE POLICY "Editors and admins can manage bank accounts"
    ON bank_accounts FOR ALL
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE workspace_id IN (
                SELECT workspace_id FROM workspace_members
                WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );

-- Filings
CREATE POLICY "Workspace members can view filings"
    ON filings FOR SELECT
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE workspace_id IN (SELECT get_my_workspace_ids())
        )
    );

CREATE POLICY "Editors and admins can manage filings"
    ON filings FOR ALL
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE workspace_id IN (
                SELECT workspace_id FROM workspace_members
                WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );

-- Documents
CREATE POLICY "Workspace members can view documents"
    ON documents FOR SELECT
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE workspace_id IN (SELECT get_my_workspace_ids())
        )
    );

CREATE POLICY "Editors and admins can manage documents"
    ON documents FOR ALL
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE workspace_id IN (
                SELECT workspace_id FROM workspace_members
                WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );

-- Share Classes & Equity Ledger
CREATE POLICY "Workspace members can view share classes"
    ON share_classes FOR SELECT
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE workspace_id IN (SELECT get_my_workspace_ids())
        )
    );

CREATE POLICY "Editors and admins can manage share classes"
    ON share_classes FOR ALL
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE workspace_id IN (
                SELECT workspace_id FROM workspace_members
                WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );

CREATE POLICY "Workspace members can view equity ledger"
    ON equity_ledger FOR SELECT
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE workspace_id IN (SELECT get_my_workspace_ids())
        )
    );

CREATE POLICY "Editors and admins can manage equity ledger"
    ON equity_ledger FOR ALL
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE workspace_id IN (
                SELECT workspace_id FROM workspace_members
                WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );

-- Appointments
CREATE POLICY "Workspace members can view director appointments"
    ON director_appointments FOR SELECT
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE workspace_id IN (SELECT get_my_workspace_ids())
        )
    );

CREATE POLICY "Editors and admins can manage director appointments"
    ON director_appointments FOR ALL
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE workspace_id IN (
                SELECT workspace_id FROM workspace_members
                WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );

CREATE POLICY "Workspace members can view partner appointments"
    ON partner_appointments FOR SELECT
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE workspace_id IN (SELECT get_my_workspace_ids())
        )
    );

CREATE POLICY "Editors and admins can manage partner appointments"
    ON partner_appointments FOR ALL
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE workspace_id IN (
                SELECT workspace_id FROM workspace_members
                WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );

CREATE POLICY "Workspace members can view trustee appointments"
    ON trustee_appointments FOR SELECT
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE workspace_id IN (SELECT get_my_workspace_ids())
        )
    );

CREATE POLICY "Editors and admins can manage trustee appointments"
    ON trustee_appointments FOR ALL
    USING (
        entity_id IN (
            SELECT id FROM entities WHERE workspace_id IN (
                SELECT workspace_id FROM workspace_members
                WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );
