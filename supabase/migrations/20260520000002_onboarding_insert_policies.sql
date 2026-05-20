-- Migration: Allow authenticated users to create workspaces during onboarding
--
-- Without these policies, RLS blocks the INSERT on both workspaces and
-- workspace_members, making onboarding impossible.

-- 1. Any authenticated user can create a workspace
CREATE POLICY "Authenticated users can create workspaces"
    ON workspaces FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Any authenticated user can add themselves to a workspace they just created
--    (They can only insert a row where user_id matches their own auth ID)
CREATE POLICY "Users can add themselves to a workspace"
    ON workspace_members FOR INSERT
    WITH CHECK (user_id = auth.uid());
