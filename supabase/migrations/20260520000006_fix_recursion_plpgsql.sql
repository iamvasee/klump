-- Migration: Fix infinite recursion in RLS
--
-- Postgres 15+ query planner will aggressively inline LANGUAGE sql functions,
-- causing the planner to statically detect an infinite recursion cycle when 
-- get_my_workspace_ids() (which queries workspace_members) is used inside the 
-- RLS policy for workspace_members itself.
--
-- Changing the function to LANGUAGE plpgsql prevents inlining, keeping the 
-- SECURITY DEFINER boundary intact and breaking the recursion loop.

CREATE OR REPLACE FUNCTION get_my_workspace_ids()
RETURNS SETOF UUID
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT workspace_id
    FROM workspace_members
    WHERE user_id = auth.uid();
END;
$$;
