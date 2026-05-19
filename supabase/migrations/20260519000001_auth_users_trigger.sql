-- Migration: Auto-sync Supabase auth users to public profile table
-- 
-- This creates a Postgres Trigger that listens to the hidden auth.users table.
-- Whenever a new user signs up, it automatically creates a corresponding
-- row in our public.users table so we can safely query their name and avatar
-- across the rest of the application.

-- 1. Create the function that will execute when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, email, full_name)
  VALUES (
    new.id,
    new.email,
    -- We passed 'full_name' in the signUp options metadata block in auth/page.tsx
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;

-- 2. Bind the function to an INSERT trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. RLS policy to allow users to update their own profile
-- (They can already view all profiles via the implicit connection to organisations,
-- but we should ensure they can only edit their own avatar/name)
CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth_user_id = auth.uid());
