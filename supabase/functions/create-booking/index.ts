import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { processBookingEmails } from "../_shared/resend.ts";

// CORS Headers for secure cross-origin requests from the React frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CreateBookingPayload {
  trip_type: "one-way" | "round-trip";
  vehicle_category: "4-seater" | "8-seater" | "19-seater";
  preferred_vehicle?: string;
  passengers: number;
  pickup_location: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  number_of_days?: number;
  customer_name: string;
  phone_number: string;
  email_address?: string;
  special_requirements?: string;
}

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function validatePayload(body: Partial<CreateBookingPayload>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 1. Customer name required and at least 2 chars
  if (!body.customer_name || body.customer_name.trim().length < 2) {
    errors.push("Customer name is required and must be at least 2 characters.");
  }

  // 2. Phone number validation: Must start with +91 and contain exactly 10 digits
  if (!body.phone_number) {
    errors.push("Phone number is required.");
  } else {
    const raw = body.phone_number.trim();
    if (!raw.startsWith("+91")) {
      errors.push("Phone number must start with country code +91.");
    } else {
      const digitsAfter91 = raw.replace(/^\+91/, "").replace(/\D/g, "");
      if (digitsAfter91.length !== 10) {
        errors.push("Phone number must contain exactly 10 digits after +91.");
      }
    }
  }

  // 3. Departure date required and cannot be in the past
  if (!body.departure_date || isNaN(Date.parse(body.departure_date))) {
    errors.push("A valid departure date is required.");
  } else {
    const today = new Date().toISOString().slice(0, 10);
    if (body.departure_date < today) {
      errors.push("Departure date cannot be in the past. Please select today or a future date.");
    }
  }

  // 4. Email format validation (if provided)
  if (body.email_address && body.email_address.trim() !== "") {
    if (!EMAIL_REGEX.test(body.email_address.trim())) {
      errors.push("Email address is not in a valid format.");
    }
  }

  // 5. Trip type validation
  if (!body.trip_type || !["one-way", "round-trip"].includes(body.trip_type)) {
    errors.push("Trip type must be either 'one-way' or 'round-trip'.");
  }

  // 6. Category validation
  if (
    !body.vehicle_category ||
    !["4-seater", "8-seater", "19-seater"].includes(body.vehicle_category)
  ) {
    errors.push("Vehicle category must be '4-seater', '8-seater', or '19-seater'.");
  }

  // 7. Passengers validation
  if (!body.passengers || body.passengers < 1) {
    errors.push("Passengers must be at least 1.");
  }

  // 8. Locations validation
  if (!body.pickup_location || body.pickup_location.trim().length === 0) {
    errors.push("Pickup location is required.");
  }
  if (!body.destination || body.destination.trim().length === 0) {
    errors.push("Destination location is required.");
  }

  return { isValid: errors.length === 0, errors };
}

serve(async (req: Request) => {
  // Handle CORS preflight options
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
    const rawBody = await req.json();
    const validation = validatePayload(rawBody);

    if (!validation.isValid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: validation.errors[0],
          errors: validation.errors,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables on server.");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const insertData = {
      trip_type: rawBody.trip_type,
      vehicle_category: rawBody.vehicle_category,
      preferred_vehicle: rawBody.preferred_vehicle?.trim() || null,
      passengers: Number(rawBody.passengers),
      pickup_location: rawBody.pickup_location.trim(),
      destination: rawBody.destination.trim(),
      departure_date: rawBody.departure_date,
      return_date: rawBody.return_date || null,
      number_of_days: Math.max(1, Number(rawBody.number_of_days || 1)),
      customer_name: rawBody.customer_name.trim(),
      phone_number: rawBody.phone_number.trim(),
      email_address: rawBody.email_address?.trim() || null,
      special_requirements: rawBody.special_requirements?.trim() || null,
      booking_status: "pending",
    };

    const { data, error } = await supabase.from("bookings").insert([insertData]).select().single();

    if (error) {
      console.error("Database insert error:", error);
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 2 & 3: Process Customer Confirmation and Admin Notification Emails via Resend
    // This is wrapped with retries and logging, and will never fail the booking creation
    let emailDelivery = {
      customer: { status: "skipped" as const },
      admin: { status: "skipped" as const },
    };

    try {
      emailDelivery = await processBookingEmails(data, supabase);
    } catch (emailErr) {
      console.error("Non-blocking email dispatch failure:", emailErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Booking enquiry created successfully",
        data,
        email_delivery: emailDelivery,
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Edge Function error:", err);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
