-- ==============================================================================
-- Rashe Holidays - Security hardening for public booking inserts
-- Migration: 20261016000000_security_hardening.sql
--
-- The public (anon) role may insert bookings directly through the REST API, and the
-- create-booking Edge Function inserts with the service role. Both paths pass through
-- the trigger below, so the limits apply no matter how a booking is submitted.
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
