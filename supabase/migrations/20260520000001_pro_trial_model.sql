-- Migration: Switch from Free Tier to Pro Trial Model
-- 
-- Every new workspace now starts with a 14-day Pro trial instead of being
-- locked into the free tier immediately. After the trial expires without
-- a Razorpay subscription, the workspace downgrades automatically.
--
-- Trial state is determined by: trial_ends_at > NOW() AND razorpay_subscription_id IS NULL
-- No new enum values needed. subscription_status tracks Razorpay payment state only.

-- 1. Add the trial_ends_at column
ALTER TABLE workspaces
    ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE;

-- 2. Change defaults for new workspaces
--    New workspaces start on Pro with generous limits during the trial
ALTER TABLE workspaces 
    ALTER COLUMN subscription_tier SET DEFAULT 'pro',
    ALTER COLUMN entity_limit SET DEFAULT 100;

-- 3. Backfill any existing workspaces to get the trial
UPDATE workspaces 
SET 
    subscription_tier = 'pro',
    entity_limit = 100,
    trial_ends_at = created_at + INTERVAL '14 days'
WHERE subscription_tier = 'free' 
  AND razorpay_subscription_id IS NULL;

-- 4. Auto-set trial_ends_at on new workspace creation
CREATE OR REPLACE FUNCTION set_trial_end_date()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.trial_ends_at IS NULL THEN
        NEW.trial_ends_at := NOW() + INTERVAL '14 days';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_workspace_created_set_trial
    BEFORE INSERT ON workspaces
    FOR EACH ROW EXECUTE FUNCTION set_trial_end_date();

-- 5. Helper function: Is the workspace's trial or subscription still valid?
--    Returns TRUE if:
--      a) They have a paid Razorpay subscription with 'active' status, OR
--      b) Their trial has not yet expired (trial_ends_at is in the future)
CREATE OR REPLACE FUNCTION is_workspace_active(ws_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM workspaces
        WHERE id = ws_id
        AND (
            -- Paid subscriber
            (razorpay_subscription_id IS NOT NULL AND subscription_status = 'active')
            -- OR trial still running
            OR (trial_ends_at IS NOT NULL AND trial_ends_at > NOW())
        )
    );
$$;

-- 6. Replace the entity INSERT policy to also check trial/subscription validity
DROP POLICY IF EXISTS "Editors and admins can insert entities" ON entities;

CREATE POLICY "Editors and admins can insert entities"
    ON entities FOR INSERT
    WITH CHECK (
        -- Rule 1: User must be an admin or editor in this workspace
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
        )
        AND
        -- Rule 2: The workspace must have an active trial or paid subscription
        is_workspace_active(workspace_id)
        AND
        -- Rule 3: Entity count must be below the workspace's limit
        (
            (SELECT count(*) FROM entities e WHERE e.workspace_id = workspace_id)
            <
            (SELECT entity_limit FROM workspaces w WHERE w.id = workspace_id)
        )
    );
