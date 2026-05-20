-- Migration: Fix workspace_members SELECT policy
--
-- The previous policy relied entirely on get_my_workspace_ids(), which could 
-- create an evaluation loop or fail during the Next.js proxy middleware check.
-- This ensures a user can ALWAYS instantly read their own membership rows.

DROP POLICY IF EXISTS "Members can view workspace membership" ON workspace_members;

CREATE POLICY "Members can view workspace membership"
    ON workspace_members FOR SELECT
    USING (
        user_id = auth.uid() 
        OR 
        workspace_id IN (SELECT get_my_workspace_ids())
    );
