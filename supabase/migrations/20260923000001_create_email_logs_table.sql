-- ==============================================================================
-- Resend Email Logs Schema - Supabase Migration
-- Migration: 20260923000001_create_email_logs_table.sql
-- 100% compliant with Supabase Security Advisor & Performance Linter
-- ==============================================================================

-- 1. Create the email_logs table
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

-- 2. Documentation comments
COMMENT ON TABLE public.email_logs IS 'Tracks all outgoing customer and admin email dispatches via Resend';
COMMENT ON COLUMN public.email_logs.id IS 'Primary key UUID for each email log entry';
COMMENT ON COLUMN public.email_logs.booking_id IS 'Foreign key reference to public.bookings(id)';
COMMENT ON COLUMN public.email_logs.email_type IS 'Type: customer_confirmation or admin_notification';
COMMENT ON COLUMN public.email_logs.recipient IS 'Recipient email address';
COMMENT ON COLUMN public.email_logs.status IS 'Status: pending, sent, or failed';
COMMENT ON COLUMN public.email_logs.error_message IS 'Error details if delivery failed or retries exhausted';
COMMENT ON COLUMN public.email_logs.sent_at IS 'Timestamp when the email was successfully accepted by Resend';

-- 3. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_email_logs_booking_id ON public.email_logs (booking_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs (status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON public.email_logs (created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Allow admins and service_role to view email logs
DROP POLICY IF EXISTS "Admins and service_role can view email logs" ON public.email_logs;
CREATE POLICY "Admins and service_role can view email logs"
ON public.email_logs
FOR SELECT
TO authenticated, service_role
USING (
    ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    OR ((SELECT auth.role()) = 'service_role')
);

-- Allow service_role to insert email logs
DROP POLICY IF EXISTS "Service role can insert email logs" ON public.email_logs;
CREATE POLICY "Service role can insert email logs"
ON public.email_logs
FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow service_role to update email logs (e.g. for status changes upon retry)
DROP POLICY IF EXISTS "Service role can update email logs" ON public.email_logs;
CREATE POLICY "Service role can update email logs"
ON public.email_logs
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);
