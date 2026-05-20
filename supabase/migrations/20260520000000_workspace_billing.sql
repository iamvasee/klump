-- Migration: Workspace Billing and Razorpay Groundwork
-- 
-- Adds billing-related columns to the workspaces table and 
-- enforces entity limits natively at the database level using RLS.

-- 1. Create Enums for Billing States
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'unpaid', 'incomplete');

-- 2. Inject Billing Columns into Workspaces
ALTER TABLE workspaces 
    ADD COLUMN subscription_tier subscription_tier NOT NULL DEFAULT 'free',
    ADD COLUMN subscription_status subscription_status NOT NULL DEFAULT 'active',
    ADD COLUMN entity_limit INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN razorpay_customer_id TEXT,
    ADD COLUMN razorpay_subscription_id TEXT;

-- Index the soft references so webhook lookups are blazing fast
CREATE INDEX idx_workspaces_razorpay_customer ON workspaces(razorpay_customer_id);
CREATE INDEX idx_workspaces_razorpay_sub ON workspaces(razorpay_subscription_id);

-- 3. Upgrade the Entity INSERT Policy to enforce the limit
-- We drop the old policy we made yesterday and replace it with the upgraded one.
DROP POLICY IF EXISTS "Editors and admins can insert entities" ON entities;

CREATE POLICY "Editors and admins can insert entities"
    ON entities FOR INSERT
    WITH CHECK (
        -- Rule 1: The user must be an admin or editor in this workspace
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
        )
        AND 
        -- Rule 2: The current count of entities in this workspace must be less than the limit
        (
            (SELECT count(id) FROM entities e WHERE e.workspace_id = workspace_id) 
            < 
            (SELECT entity_limit FROM workspaces w WHERE w.id = workspace_id)
        )
    );
