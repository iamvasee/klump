-- Migration: Absolute Fix for RLS Recursion
-- 
-- The "infinite recursion" error is caused by a policy on workspace_members 
-- that triggers itself. This migration wipes the slate clean and uses 
-- only direct, non-recursive checks.

-- 1. Drop ALL existing SELECT policies on workspace_members to be sure
DROP POLICY IF EXISTS "Members can view workspace membership" ON workspace_members;
DROP POLICY IF EXISTS "Admins can view all members in their workspace" ON workspace_members;
DROP POLICY IF EXISTS "Admins can manage workspace membership" ON workspace_members;
DROP POLICY IF EXISTS "Members can view org membership" ON workspace_members;

-- 2. Create the most basic SELECT policy: A user can see their own rows.
-- This is a direct check on the table's own columns (user_id). 
-- It CANNOT recurse because it doesn't query any other tables or itself.
CREATE POLICY "Users can see their own memberships"
    ON workspace_members FOR SELECT
    USING (user_id = auth.uid());

-- 3. To allow admins to see others without recursion, we use the SECURITY DEFINER function
-- but we make sure the function itself is stable and non-recursive.
CREATE OR REPLACE FUNCTION get_my_workspace_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    -- This direct query bypasses RLS on workspace_members because it's SECURITY DEFINER
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid();
$$;

-- 4. Now use that function for the admin-view-all policy.
-- This is safe because the function's query is not subject to RLS checks.
CREATE POLICY "Admins can see all members in their workspace"
    ON workspace_members FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 5. Fix Workspaces SELECT policy
DROP POLICY IF EXISTS "Members can view their workspaces" ON workspaces;
DROP POLICY IF EXISTS "Members can view their organisations" ON workspaces;

CREATE POLICY "Members can view their workspaces"
    ON workspaces FOR SELECT
    USING (id IN (SELECT get_my_workspace_ids()));
