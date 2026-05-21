-- Waitlist signups table
-- Capped at 25 entries via a trigger
CREATE TABLE IF NOT EXISTS public.waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  organization TEXT NOT NULL,
  role TEXT NOT NULL,
  challenge TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enforce a hard cap of 25 waitlist signups
CREATE OR REPLACE FUNCTION public.enforce_waitlist_cap()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT count(*) FROM public.waitlist_signups) >= 25 THEN
    RAISE EXCEPTION 'Waitlist is full. Maximum 25 signups allowed.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER waitlist_cap_trigger
  BEFORE INSERT ON public.waitlist_signups
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_waitlist_cap();

-- RLS: Allow anonymous inserts (for the landing page form)
-- but no reads/updates/deletes from the client
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (the trigger handles the cap)
CREATE POLICY "Allow anonymous waitlist signups"
  ON public.waitlist_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- No SELECT/UPDATE/DELETE for anon — only you can see these via dashboard/service role
