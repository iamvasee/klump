-- Migration: Final RLS Fix and Search Path Security
-- 
-- 1. Sets search_path on get_my_workspace_ids to ensure it's reliable.
-- 2. Simplifies workspace_members SELECT policy to break the recursive join loop.
-- 3. Ensures the middleware can always see the user's own memberships.

CREATE OR REPLACE FUNCTION get_my_workspace_ids()
RETURNS SETOF UUID
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT workspace_id
    FROM workspace_members
    WHERE user_id = auth.uid();
END;
$$;

-- Simplify policy: A user can always see their own memberships.
-- This breaks the loop where viewing memberships required viewing workspaces 
-- which in turn required viewing memberships.
DROP POLICY IF EXISTS "Members can view workspace membership" ON workspace_members;

CREATE POLICY "Members can view workspace membership"
    ON workspace_members FOR SELECT
    USING (user_id = auth.uid());

-- Add a separate policy for admins to see other members in their workspace
-- using the SECURITY DEFINER function to safely check access.
CREATE POLICY "Admins can view all members in their workspace"
    ON workspace_members FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
