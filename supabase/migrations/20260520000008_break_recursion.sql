-- Migration: Break RLS Recursion and Fix Middleware Query
-- 
-- The previous "Admins can view all members" policy was recursive on 
-- workspace_members, causing joins in the middleware to fail or return 0 rows.
-- This migration removes the recursive policy and ensures the join is stable.

-- 1. Remove the recursive policy
DROP POLICY IF EXISTS "Admins can view all members in their workspace" ON workspace_members;

-- 2. Ensure the basic membership policy is clean
DROP POLICY IF EXISTS "Members can view workspace membership" ON workspace_members;
CREATE POLICY "Members can view workspace membership"
    ON workspace_members FOR SELECT
    USING (user_id = auth.uid());

-- 3. If we want admins to see other members, we should use a non-recursive approach
-- For now, we prioritize the middleware join stability.

-- 4. Ensure workspaces policy is also stable
DROP POLICY IF EXISTS "Members can view their workspaces" ON workspaces;
CREATE POLICY "Members can view their workspaces"
    ON workspaces FOR SELECT
    USING (id IN (SELECT get_my_workspace_ids()));
