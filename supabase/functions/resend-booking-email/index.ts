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
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@yourdomain.com";
    const defaultFrom =
      Deno.env.get("RESEND_FROM_EMAIL") || "Anand Holidays <onboarding@resend.dev>";
    const companyName = Deno.env.get("COMPANY_NAME") || "Anand Holidays";
    const appUrl = Deno.env.get("APP_URL") || "https://yourdomain.com";

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

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the booking record
    const { data: booking, error: fetchErr } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", booking_id)
      .single();

    if (fetchErr || !booking) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Booking not found: ${fetchErr?.message || "No record matching ID"}`,
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

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
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Resend edge function error:", err);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
