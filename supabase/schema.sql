-- ==============================================================================
-- Rashe Holidays (ooty-rides-main) - Supabase Complete Database Schema
-- Run this in your Supabase SQL Editor: Dashboard -> SQL Editor -> New Query
-- 100% compliant with Supabase Security Advisor & Performance Linter
-- ==============================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create the bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Trip Details
    trip_type TEXT NOT NULL CHECK (trip_type IN ('one-way', 'round-trip')),
    vehicle_category TEXT NOT NULL CHECK (vehicle_category IN ('4-seater', '8-seater', '19-seater')),
    preferred_vehicle TEXT,
    passengers INTEGER NOT NULL CHECK (passengers > 0 AND passengers <= 30),

    -- Journey Details
    pickup_location TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_date DATE NOT NULL,
    return_date DATE,
    number_of_days INTEGER NOT NULL DEFAULT 1 CHECK (number_of_days > 0),

    -- Customer Details
    customer_name TEXT NOT NULL CHECK (char_length(trim(customer_name)) >= 2),
    phone_number TEXT NOT NULL CHECK (
        phone_number ~* '^\+91[\s\-]?[0-9]{10}$'
        OR phone_number ~* '^\+91[\s\-]?[0-9]{5}[\s\-]?[0-9]{5}$'
    ),
    email_address TEXT CHECK (email_address IS NULL OR email_address ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),



    -- Additional Information
    special_requirements TEXT,
    booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'contacted', 'confirmed', 'completed', 'cancelled'))
);

-- 3. Comments for documentation
COMMENT ON TABLE public.bookings IS 'Stores customer ride and cab booking enquiries for Rashe Holidays';
COMMENT ON COLUMN public.bookings.id IS 'Unique identifier for the booking (UUID)';
COMMENT ON COLUMN public.bookings.booking_status IS 'Lifecycle state: pending, contacted, confirmed, completed, cancelled';

-- 4. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_status ON public.bookings (booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_departure_date ON public.bookings (departure_date ASC);
CREATE INDEX IF NOT EXISTS idx_bookings_phone_number ON public.bookings (phone_number);

-- 5. Trigger to automatically update updated_at timestamp
-- Fixed: Explicit search_path prevents mutable search_path warning
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_bookings_updated_at ON public.bookings;
CREATE TRIGGER trg_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
-- Requirement 3: Public users can insert bookings
DROP POLICY IF EXISTS "Public users can insert bookings" ON public.bookings;
CREATE POLICY "Public users can insert bookings"
ON public.bookings
FOR INSERT
TO public
WITH CHECK (true);

-- Requirements 4 & 5: Public cannot view bookings; only Admins can view/manage.
-- Fixed: 
-- 1. Uses ONLY app_metadata (prevents critical 'user_metadata' escalation vulnerability).
-- 2. Uses (SELECT ...) wrapper for auth.jwt() / auth.role() (fixes 'Auth RLS Initialization Plan' performance warning).
DROP POLICY IF EXISTS "Admin users can view all bookings" ON public.bookings;
CREATE POLICY "Admin users can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
    ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    OR ((SELECT auth.role()) = 'service_role')
);

DROP POLICY IF EXISTS "Admin users can update bookings" ON public.bookings;
CREATE POLICY "Admin users can update bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (
    ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    OR ((SELECT auth.role()) = 'service_role')
)
WITH CHECK (
    ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    OR ((SELECT auth.role()) = 'service_role')
);

DROP POLICY IF EXISTS "Admin users can delete bookings" ON public.bookings;
CREATE POLICY "Admin users can delete bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (
    ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    OR ((SELECT auth.role()) = 'service_role')
);

-- ==============================================================================
-- 7. Email Logs Table (Resend Integration)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    email_type TEXT NOT NULL CHECK (email_type IN ('customer_confirmation', 'admin_notification')),
    recipient TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.email_logs IS 'Tracks all outgoing customer and admin email dispatches via Resend';
COMMENT ON COLUMN public.email_logs.id IS 'Primary key UUID for each email log entry';
COMMENT ON COLUMN public.email_logs.booking_id IS 'Foreign key reference to public.bookings(id)';
COMMENT ON COLUMN public.email_logs.email_type IS 'Type: customer_confirmation or admin_notification';
COMMENT ON COLUMN public.email_logs.recipient IS 'Recipient email address';
COMMENT ON COLUMN public.email_logs.status IS 'Status: pending, sent, or failed';
COMMENT ON COLUMN public.email_logs.error_message IS 'Error details if delivery failed or retries exhausted';
COMMENT ON COLUMN public.email_logs.sent_at IS 'Timestamp when the email was successfully accepted by Resend';

CREATE INDEX IF NOT EXISTS idx_email_logs_booking_id ON public.email_logs (booking_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs (status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON public.email_logs (created_at DESC);

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins and service_role can view email logs" ON public.email_logs;
CREATE POLICY "Admins and service_role can view email logs"
ON public.email_logs
FOR SELECT
TO authenticated, service_role
USING (
    ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    OR ((SELECT auth.role()) = 'service_role')
);

DROP POLICY IF EXISTS "Service role can insert email logs" ON public.email_logs;
CREATE POLICY "Service role can insert email logs"
ON public.email_logs
FOR INSERT
TO service_role
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can update email logs" ON public.email_logs;
CREATE POLICY "Service role can update email logs"
ON public.email_logs
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);



-- ==============================================================================
-- 8. Security hardening (see migrations/20261016000000_security_hardening.sql)
-- ==============================================================================

-- 1. Length caps on free-text fields (NOT VALID: enforced for new rows, existing rows untouched)
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_text_length_caps;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_text_length_caps CHECK (
    char_length(customer_name) <= 100
    AND char_length(pickup_location) <= 200
    AND char_length(destination) <= 200
    AND (preferred_vehicle IS NULL OR char_length(preferred_vehicle) <= 100)
    AND (email_address IS NULL OR char_length(email_address) <= 254)
    AND (special_requirements IS NULL OR char_length(special_requirements) <= 1000)
    AND number_of_days <= 60
) NOT VALID;

-- 2. Insert guard: server-controlled fields + rate limiting
CREATE OR REPLACE FUNCTION public.enforce_booking_insert_rules()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    recent_for_contact INTEGER;
    recent_total INTEGER;
    new_phone_digits TEXT := regexp_replace(NEW.phone_number, '\D', '', 'g');
BEGIN
    -- Clients must not choose these values (e.g. pre-confirming a booking or
    -- back-dating created_at to dodge the rate limit).
    NEW.booking_status := 'pending';
    NEW.created_at := timezone('utc'::text, now());
    NEW.updated_at := timezone('utc'::text, now());

    -- Max 3 enquiries per phone number / email address per hour
    SELECT count(*) INTO recent_for_contact
    FROM public.bookings b
    WHERE b.created_at > timezone('utc'::text, now()) - interval '1 hour'
      AND (
        regexp_replace(b.phone_number, '\D', '', 'g') = new_phone_digits
        OR (NEW.email_address IS NOT NULL AND lower(b.email_address) = lower(NEW.email_address))
      );

    IF recent_for_contact >= 3 THEN
        RAISE EXCEPTION 'Too many booking requests for this phone number or email. Please call or WhatsApp us instead.'
            USING ERRCODE = 'P0001';
    END IF;

    -- Site-wide burst cap: 25 enquiries per 10 minutes (protects the admin inbox / email quota)
    SELECT count(*) INTO recent_total
    FROM public.bookings b
    WHERE b.created_at > timezone('utc'::text, now()) - interval '10 minutes';

    IF recent_total >= 25 THEN
        RAISE EXCEPTION 'We are receiving an unusually high number of requests. Please call or WhatsApp us instead.'
            USING ERRCODE = 'P0001';
    END IF;

    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_booking_insert_rules() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_bookings_insert_rules ON public.bookings;
CREATE TRIGGER trg_bookings_insert_rules
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.enforce_booking_insert_rules();

-- 3. Public insert policy: only brand-new pending enquiries
DROP POLICY IF EXISTS "Public users can insert bookings" ON public.bookings;
CREATE POLICY "Public users can insert bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (booking_status = 'pending');
