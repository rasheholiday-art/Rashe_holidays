import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import {
  processBookingEmails,
  sendEmailWithRetry,
  logEmailStatus,
  BookingEmailData,
} from "../_shared/resend.ts";
import { renderCustomerConfirmationEmail } from "../_shared/emails/CustomerConfirmationEmail.tsx";
import { renderAdminNotificationEmail } from "../_shared/emails/AdminNotificationEmail.tsx";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed. Use POST." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const { booking_id, email_type = "both" } = await req.json();

    if (!booking_id || typeof booking_id !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Valid booking_id is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "rasheholiday@gmail.com";
    const defaultFrom =
      Deno.env.get("RESEND_FROM_EMAIL") || "Rashe Holidays <bookings@rasheholidays.com>";
    const companyName = Deno.env.get("COMPANY_NAME") || "Rashe Holidays";
    const appUrl = Deno.env.get("APP_URL") || "https://rasheholidays.com";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables on server.");
    }

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "RESEND_API_KEY is not configured on the server.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Only a signed-in caller whose own session can read this booking (i.e. the owner/admin,
    // enforced by Row-Level Security) may trigger a resend. The public anon key is not enough.
    const accessToken = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData } = accessToken
      ? await callerClient.auth.getUser(accessToken)
      : { data: { user: null } };

    if (!userData?.user) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch the booking record with the caller's permissions (RLS)
    const { data: booking, error: fetchErr } = await callerClient
      .from("bookings")
      .select("*")
      .eq("id", booking_id)
      .maybeSingle();

    if (fetchErr || !booking) {
      return new Response(
        JSON.stringify({ success: false, error: "Booking not found." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Service-role client is only used for writing email_logs
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const bookingData: BookingEmailData = booking;
    const results: Record<string, { status: "sent" | "failed" | "skipped"; error?: string }> = {};

    // 1. Resend customer confirmation if requested
    if (email_type === "customer_confirmation" || email_type === "both") {
      if (!bookingData.email_address || bookingData.email_address.trim().length === 0) {
        results.customer = {
          status: "skipped",
          error: "Customer did not provide an email address.",
        };
      } else {
        const { html, text, subject } = renderCustomerConfirmationEmail({
          customerName: bookingData.customer_name,
          tripType: bookingData.trip_type,
          vehicleCategory: bookingData.vehicle_category,
          passengers: bookingData.passengers,
          pickupLocation: bookingData.pickup_location,
          destination: bookingData.destination,
          departureDate: bookingData.departure_date,
          returnDate: bookingData.return_date,
          companyName,
        });

        const sendRes = await sendEmailWithRetry(
          {
            from: defaultFrom,
            to: bookingData.email_address.trim(),
            subject,
            html,
            text,
          },
          resendApiKey,
        );

        await logEmailStatus(supabase, {
          bookingId: bookingData.id,
          emailType: "customer_confirmation",
          recipient: bookingData.email_address.trim(),
          status: sendRes.success ? "sent" : "failed",
          errorMessage: sendRes.error || null,
        });

        results.customer = {
          status: sendRes.success ? "sent" : "failed",
          error: sendRes.error,
        };
      }
    }

    // 2. Resend admin notification if requested
    if (email_type === "admin_notification" || email_type === "both") {
      const { html, text, subject } = renderAdminNotificationEmail({
        bookingId: bookingData.id,
        customerName: bookingData.customer_name,
        phoneNumber: bookingData.phone_number,
        emailAddress: bookingData.email_address,
        tripType: bookingData.trip_type,
        vehicleCategory: bookingData.vehicle_category,
        preferredVehicle: bookingData.preferred_vehicle,
        passengers: bookingData.passengers,
        pickupLocation: bookingData.pickup_location,
        destination: bookingData.destination,
        departureDate: bookingData.departure_date,
        returnDate: bookingData.return_date,
        numberOfDays: bookingData.number_of_days,
        specialRequirements: bookingData.special_requirements,
        createdAt: bookingData.created_at,
        adminPortalUrl: `${appUrl}/admin`,
      });

      const sendRes = await sendEmailWithRetry(
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
        bookingId: bookingData.id,
        emailType: "admin_notification",
        recipient: adminEmail.trim(),
        status: sendRes.success ? "sent" : "failed",
        errorMessage: sendRes.error || null,
      });

      results.admin = {
        status: sendRes.success ? "sent" : "failed",
        error: sendRes.error,
      };
    }

    const anyFailed = Object.values(results).some((r) => r.status === "failed");

    return new Response(
      JSON.stringify({
        success: !anyFailed,
        message: anyFailed ? "Some emails failed to send" : "Emails dispatched successfully",
        results,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = "Internal server error";
    console.error("Resend edge function error:", err);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
