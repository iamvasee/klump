-- Migration: The "Nuclear Option" for RLS Recursion
-- 
-- I re-introduced recursion in the last migration by mistake. 
-- This migration wipes EVERY possible policy name we've used and 
-- replaces them with a zero-recursion architecture using SECURITY DEFINER.

-- 1. Nuke everything on workspace_members
DROP POLICY IF EXISTS "Members can view workspace membership" ON workspace_members;
DROP POLICY IF EXISTS "Admins can view all members in their workspace" ON workspace_members;
DROP POLICY IF EXISTS "Admins can manage workspace membership" ON workspace_members;
DROP POLICY IF EXISTS "Members can view org membership" ON workspace_members;
DROP POLICY IF EXISTS "Users can see their own memberships" ON workspace_members;
DROP POLICY IF EXISTS "Admins can see all members in their workspace" ON workspace_members;

-- 2. Nuke everything on workspaces
DROP POLICY IF EXISTS "Members can view their workspaces" ON workspaces;
DROP POLICY IF EXISTS "Members can view their organisations" ON workspaces;
DROP POLICY IF EXISTS "Admins can update their workspace" ON workspaces;
DROP POLICY IF EXISTS "Authenticated users can create workspaces" ON workspaces;

-- 3. Create clean, non-recursive helper functions
CREATE OR REPLACE FUNCTION get_my_workspace_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    -- This bypasses RLS on workspace_members because it's SECURITY DEFINER
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION is_workspace_admin(ws_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    -- This also bypasses RLS
    SELECT EXISTS (
        SELECT 1 FROM workspace_members 
        WHERE workspace_id = ws_id 
        AND user_id = auth.uid() 
        AND role = 'admin'
    );
$$;

-- 4. Re-create Workspaces policies (Non-recursive)
CREATE POLICY "Workspaces: SELECT"
    ON workspaces FOR SELECT
    USING (id IN (SELECT get_my_workspace_ids()));

CREATE POLICY "Workspaces: INSERT"
    ON workspaces FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Workspaces: UPDATE"
    ON workspaces FOR UPDATE
    USING (is_workspace_admin(id));

-- 5. Re-create Workspace Members policies (Zero recursion)
-- A user can always see their own row
CREATE POLICY "Workspace Members: SELECT (self)"
    ON workspace_members FOR SELECT
    USING (user_id = auth.uid());

-- An admin can see others in the same workspace (Safe because is_workspace_admin bypasses RLS)
CREATE POLICY "Workspace Members: SELECT (admin)"
    ON workspace_members FOR SELECT
    USING (is_workspace_admin(workspace_id));

CREATE POLICY "Workspace Members: INSERT"
    ON workspace_members FOR INSERT
    WITH CHECK (user_id = auth.uid() OR is_workspace_admin(workspace_id));

CREATE POLICY "Workspace Members: DELETE"
    ON workspace_members FOR DELETE
    USING (is_workspace_admin(workspace_id));
