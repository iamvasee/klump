-- Migration: RPC for atomic workspace creation
--
-- Fixes the chicken-and-egg RLS problem where a user couldn't SELECT a newly 
-- created workspace because they weren't added to workspace_members yet.
-- This function runs as SECURITY DEFINER to bypass RLS and perform both inserts atomically.

CREATE OR REPLACE FUNCTION create_workspace_with_admin(workspace_name TEXT, workspace_slug TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_workspace_id UUID;
BEGIN
    -- Ensure the user is authenticated
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 1. Insert the workspace and capture its ID
    INSERT INTO workspaces (name, slug)
    VALUES (workspace_name, workspace_slug)
    RETURNING id INTO new_workspace_id;

    -- 2. Insert the user as admin
    INSERT INTO workspace_members (workspace_id, user_id, role)
    VALUES (new_workspace_id, auth.uid(), 'admin');

    -- Return the new workspace ID
    RETURN new_workspace_id;
END;
$$;
