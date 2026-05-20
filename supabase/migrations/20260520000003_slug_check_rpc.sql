-- Migration: Secure slug availability check
--
-- Creates an RPC function that checks if a workspace slug is already taken.
-- Runs as SECURITY DEFINER so it bypasses RLS — authenticated users can check
-- slug availability without being able to read any workspace data.

CREATE OR REPLACE FUNCTION check_slug_available(slug_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT NOT EXISTS (
        SELECT 1 FROM workspaces WHERE slug = slug_to_check
    );
$$;
