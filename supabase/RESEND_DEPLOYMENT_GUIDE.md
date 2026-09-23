# Resend Email Integration Deployment & Setup Guide

This guide walks you through deploying the Resend email notification system for the booking engine.

---

## Architecture Overview

When a customer submits a booking:
1. **Database Persistence**: Booking is saved immediately into `public.bookings`.
2. **Customer Confirmation**: Sent to the customer's email (if provided) using the `CustomerConfirmationEmail` template.
3. **Admin Alert**: Sent to `ADMIN_EMAIL` with full customer, journey, and vehicle details using the `AdminNotificationEmail` template.
4. **Retry Handling**: Exponential backoff retry loop (up to 3 attempts with jitter) protects against transient network drops and rate limits.
5. **Logging & Non-Blocking Isolation**: Every dispatch is logged in `public.email_logs`. If Resend is down or an invalid email is provided, the booking **never fails**, and the failure is logged for later resending.
6. **Resend Endpoint**: An admin can re-trigger failed emails directly from the Admin Portal or via the `resend-booking-email` function.

---

## Step 1: Run the Database Migration

In your **Supabase Dashboard**:
1. Go to **SQL Editor** -> **New Query**.
2. Paste the contents of [`supabase/schema.sql`](./schema.sql) (or migration [`supabase/migrations/20260923000001_create_email_logs_table.sql`](./migrations/20260923000001_create_email_logs_table.sql)).
3. Click **Run**.

This creates the `email_logs` table, indexes, and Row Level Security policies.

---

## Step 2: Configure Supabase Edge Function Secrets

In your **Supabase Dashboard** -> **Project Settings** -> **Edge Functions** -> **Secrets** (or via CLI):

Add the following environment variables:

| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| `RESEND_API_KEY` | Your API key from [resend.com](https://resend.com/api-keys) | `re_123456789abcdef` |
| `ADMIN_EMAIL` | Destination email address for new booking alerts | `admin@yourdomain.com` |
| `RESEND_FROM_EMAIL` | Sender address (use `onboarding@resend.dev` for testing) | `Anand Holidays <onboarding@resend.dev>` |
| `COMPANY_NAME` | Brand name shown on emails and subjects | `Anand Holidays` |
| `APP_URL` | Base URL of your deployed website | `https://your-domain.com` |

### Or via Supabase CLI:
```bash
supabase secrets set RESEND_API_KEY="re_your_api_key_here" \
  ADMIN_EMAIL="admin@yourdomain.com" \
  RESEND_FROM_EMAIL="Anand Holidays <onboarding@resend.dev>" \
  COMPANY_NAME="Anand Holidays"
```

---

## Step 3: Deploy the Edge Functions

From your project root, run:

```bash
# 1. Deploy the booking creation function (saves booking + triggers emails)
supabase functions deploy create-booking --no-verify-jwt

# 2. Deploy the resend function (allows resending failed emails later)
supabase functions deploy resend-booking-email --no-verify-jwt
```

> **Note**: `--no-verify-jwt` is used for `create-booking` so that anonymous website visitors can submit booking enquiries without requiring pre-authentication.

---

## Step 4: Verify & Test

### A. Submit a Test Booking
1. Open the website booking form at `/booking`.
2. Fill in the departure date, route, vehicle, name, phone (`+91 98765 43210`), and **your own email address**.
3. Submit the booking.

### B. Verify in Resend Dashboard
1. Open [resend.com/emails](https://resend.com/emails).
2. You will see two emails sent:
   - **Customer Confirmation**: `Booking Request Received - Anand Holidays`
   - **Admin Notification**: `New Travel Booking Received`

### C. Verify in Supabase
1. In Supabase Dashboard, open **Table Editor** -> `email_logs`.
2. You will see rows with `status: 'sent'`, the recipient, and timestamp.

### D. Test the "Resend Emails" Button
1. Open the Admin Portal at `/admin` (passcode: `ootyadmin2026`).
2. Click on the booking you just submitted.
3. In the modal, locate the **Email Notifications (Resend)** card.
4. Click **Resend Emails** to verify the retry mechanism.
