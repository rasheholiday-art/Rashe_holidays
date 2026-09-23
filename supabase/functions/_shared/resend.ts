import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import {
  renderCustomerConfirmationEmail,
  CustomerConfirmationEmailProps,
} from "./emails/CustomerConfirmationEmail.tsx";
import {
  renderAdminNotificationEmail,
  AdminNotificationEmailProps,
} from "./emails/AdminNotificationEmail.tsx";

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
  attempts: number;
}

export interface BookingEmailData {
  id: string;
  customer_name: string;
  phone_number: string;
  email_address?: string | null;
  trip_type: string;
  vehicle_category: string;
  preferred_vehicle?: string | null;
  passengers: number;
  pickup_location: string;
  destination: string;
  departure_date: string;
  return_date?: string | null;
  number_of_days: number;
  special_requirements?: string | null;
  created_at?: string;
}

/**
 * Sends an email via Resend API with exponential backoff retry handling.
 */
export async function sendEmailWithRetry(
  payload: {
    from: string;
    to: string;
    subject: string;
    html: string;
    text: string;
  },
  apiKey: string,
  maxRetries = 3,
): Promise<SendEmailResult> {
  let attempt = 0;
  let lastError = "";

  while (attempt < maxRetries) {
    attempt++;
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let responseJson: Record<string, unknown> = {};
      try {
        responseJson = JSON.parse(responseText);
      } catch {
        // Fallback for non-JSON response
      }

      if (response.ok) {
        return {
          success: true,
          id: (responseJson.id as string) || "resend-ok",
          attempts: attempt,
        };
      }

      // Check if retryable status code (429 Rate Limit, 500, 502, 503, 504)
      const isRetryable = response.status === 429 || response.status >= 500;
      lastError =
        (responseJson.message as string) ||
        (responseJson.error as string) ||
        `HTTP ${response.status}: ${responseText}`;

      if (!isRetryable || attempt >= maxRetries) {
        break;
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : String(err);
      if (attempt >= maxRetries) {
        break;
      }
    }

    // Exponential backoff with jitter: (2^(attempt - 1) * 500ms) + random(0-250ms)
    const backoffMs = Math.pow(2, attempt - 1) * 500 + Math.random() * 250;
    await new Promise((resolve) => setTimeout(resolve, backoffMs));
  }

  return {
    success: false,
    error: lastError || "Failed to send email after retries",
    attempts: attempt,
  };
}

/**
 * Logs an email dispatch event to the public.email_logs table.
 */
export async function logEmailStatus(
  supabase: SupabaseClient,
  logData: {
    bookingId: string;
    emailType: "customer_confirmation" | "admin_notification";
    recipient: string;
    status: "sent" | "failed" | "pending";
    errorMessage?: string | null;
  },
): Promise<void> {
  try {
    const { error } = await supabase.from("email_logs").insert([
      {
        booking_id: logData.bookingId,
        email_type: logData.emailType,
        recipient: logData.recipient,
        status: logData.status,
        error_message: logData.errorMessage || null,
        sent_at: logData.status === "sent" ? new Date().toISOString() : null,
      },
    ]);

    if (error) {
      console.error("[EmailLog] Failed to insert log record:", error.message);
    }
  } catch (err) {
    console.error("[EmailLog] Unexpected logging exception:", err);
  }
}

/**
 * Dispatches both customer confirmation and admin notification emails for a booking.
 * Guaranteed not to throw or fail the parent booking process.
 */
export async function processBookingEmails(
  booking: BookingEmailData,
  supabase: SupabaseClient,
): Promise<{
  customer: { status: "sent" | "failed" | "skipped"; error?: string };
  admin: { status: "sent" | "failed" | "skipped"; error?: string };
}> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
  const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@yourdomain.com";
  const defaultFrom = Deno.env.get("RESEND_FROM_EMAIL") || "Anand Holidays <onboarding@resend.dev>";
  const companyName = Deno.env.get("COMPANY_NAME") || "Anand Holidays";
  const appUrl = Deno.env.get("APP_URL") || "https://yourdomain.com";

  const results: {
    customer: { status: "sent" | "failed" | "skipped"; error?: string };
    admin: { status: "sent" | "failed" | "skipped"; error?: string };
  } = {
    customer: { status: "skipped" },
    admin: { status: "skipped" },
  };

  if (!resendApiKey) {
    const warning = "RESEND_API_KEY environment variable is not configured.";
    console.warn(`[processBookingEmails] ${warning}`);

    // Log the configuration gap into email_logs so the admin can see it and retry later
    if (booking.email_address) {
      await logEmailStatus(supabase, {
        bookingId: booking.id,
        emailType: "customer_confirmation",
        recipient: booking.email_address,
        status: "failed",
        errorMessage: warning,
      });
      results.customer = { status: "failed", error: warning };
    }

    await logEmailStatus(supabase, {
      bookingId: booking.id,
      emailType: "admin_notification",
      recipient: adminEmail,
      status: "failed",
      errorMessage: warning,
    });
    results.admin = { status: "failed", error: warning };

    return results;
  }

  // 1. Send Customer Confirmation Email (if customer provided email)
  if (booking.email_address && booking.email_address.trim().length > 0) {
    try {
      const { html, text, subject } = renderCustomerConfirmationEmail({
        customerName: booking.customer_name,
        tripType: booking.trip_type,
        vehicleCategory: booking.vehicle_category,
        passengers: booking.passengers,
        pickupLocation: booking.pickup_location,
        destination: booking.destination,
        departureDate: booking.departure_date,
        returnDate: booking.return_date,
        companyName,
      });

      const customerResult = await sendEmailWithRetry(
        {
          from: defaultFrom,
          to: booking.email_address.trim(),
          subject,
          html,
          text,
        },
        resendApiKey,
      );

      await logEmailStatus(supabase, {
        bookingId: booking.id,
        emailType: "customer_confirmation",
        recipient: booking.email_address.trim(),
        status: customerResult.success ? "sent" : "failed",
        errorMessage: customerResult.error || null,
      });

      results.customer = {
        status: customerResult.success ? "sent" : "failed",
        error: customerResult.error,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[processBookingEmails] Customer email unexpected failure:", msg);
      await logEmailStatus(supabase, {
        bookingId: booking.id,
        emailType: "customer_confirmation",
        recipient: booking.email_address.trim(),
        status: "failed",
        errorMessage: msg,
      });
      results.customer = { status: "failed", error: msg };
    }
  } else {
    results.customer = { status: "skipped" };
  }

  // 2. Send Admin Notification Email
  if (adminEmail && adminEmail.trim().length > 0) {
    try {
      const { html, text, subject } = renderAdminNotificationEmail({
        bookingId: booking.id,
        customerName: booking.customer_name,
        phoneNumber: booking.phone_number,
        emailAddress: booking.email_address,
        tripType: booking.trip_type,
        vehicleCategory: booking.vehicle_category,
        preferredVehicle: booking.preferred_vehicle,
        passengers: booking.passengers,
        pickupLocation: booking.pickup_location,
        destination: booking.destination,
        departureDate: booking.departure_date,
        returnDate: booking.return_date,
        numberOfDays: booking.number_of_days,
        specialRequirements: booking.special_requirements,
        createdAt: booking.created_at,
        adminPortalUrl: `${appUrl}/admin`,
      });

      const adminResult = await sendEmailWithRetry(
        {
          from: defaultFrom,
          to: adminEmail.trim(),
          subject,
          html,
          text,
        },
        resendApiKey,
      );

      await logEmailStatus(supabase, {
        bookingId: booking.id,
        emailType: "admin_notification",
        recipient: adminEmail.trim(),
        status: adminResult.success ? "sent" : "failed",
        errorMessage: adminResult.error || null,
      });

      results.admin = {
        status: adminResult.success ? "sent" : "failed",
        error: adminResult.error,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[processBookingEmails] Admin email unexpected failure:", msg);
      await logEmailStatus(supabase, {
        bookingId: booking.id,
        emailType: "admin_notification",
        recipient: adminEmail.trim(),
        status: "failed",
        errorMessage: msg,
      });
      results.admin = { status: "failed", error: msg };
    }
  }

  return results;
}
