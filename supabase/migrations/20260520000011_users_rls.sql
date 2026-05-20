-- Migration: Enable RLS on users table and add SELECT policy
--
-- Ensures that the users table is protected by RLS and that users
-- can see their own profiles.

-- 1. Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON users;

-- 3. Create SELECT policy
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth_user_id = auth.uid());

-- 4. Ensure the UPDATE policy from previous migrations is still there or recreated
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth_user_id = auth.uid());
