import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { renderCustomerConfirmationEmail } from "@/emails/CustomerConfirmationEmail";
import { renderAdminNotificationEmail } from "@/emails/AdminNotificationEmail";
import { EMAIL_COMPANY } from "@/emails/theme";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase";
import type { Database } from "@/types/database.types";

interface BookingEmailPayload {
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
  number_of_days?: number;
  waiting_days?: number | null;
  special_requirements?: string | null;
  created_at?: string | undefined;
}

type RawPayload = { [K in keyof BookingEmailPayload]?: unknown } & { email_type?: unknown };
type EmailType = "customer_confirmation" | "admin_notification" | "both";
type SendStatus = { status: "sent" | "failed" | "skipped"; id?: string | undefined; error?: string | undefined };

const MAX_BODY_BYTES = 10_000;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PHONE_REGEX = /^\+91[\s-]?[0-9]{5}[\s-]?[0-9]{5}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Best-effort, per-isolate limiter for the unauthenticated fallback path. It is not a
// substitute for an edge/WAF rate-limit rule, but it stops trivial request loops.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_PER_IP = 5;
const RATE_LIMIT_GLOBAL = 30;
const recentByIp = new Map<string, number[]>();
let recentGlobal: number[] = [];

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  recentGlobal = recentGlobal.filter((t) => now - t < RATE_WINDOW_MS);
  const hits = (recentByIp.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_LIMIT_PER_IP || recentGlobal.length >= RATE_LIMIT_GLOBAL) {
    recentByIp.set(ip, hits);
    return true;
  }
  hits.push(now);
  recentGlobal.push(now);
  recentByIp.set(ip, hits);
  if (recentByIp.size > 5000) recentByIp.clear();
  return false;
}

function optionalString(value: unknown, max: number): string | null | false {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || value.length > max) return false;
  return value;
}

/** Strict validation for the unauthenticated payload; returns null when anything is off. */
function parsePublicPayload(raw: unknown): BookingEmailPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as RawPayload;
  const str = (v: unknown, max: number) =>
    typeof v === "string" && v.trim().length > 0 && v.length <= max ? v.trim() : null;

  const customerName = str(b.customer_name, 100);
  const phone = str(b.phone_number, 20);
  const pickup = str(b.pickup_location, 200);
  const destination = str(b.destination, 200);
  const departure = str(b.departure_date, 10);
  const vehicleCategory = str(b.vehicle_category, 40);
  const id = str(b.id, 64);
  const email = optionalString(b.email_address, 254);
  const preferred = optionalString(b.preferred_vehicle, 100);
  const returnDate = optionalString(b.return_date, 10);
  const special = optionalString(b.special_requirements, 1000);
  const createdAt = optionalString(b.created_at, 40);
  const passengers = Number(b.passengers);
  const days = b.number_of_days === undefined ? 1 : Number(b.number_of_days);
  const waiting = b.waiting_days === undefined || b.waiting_days === null ? 0 : Number(b.waiting_days);

  if (!customerName || customerName.length < 2 || !phone || !PHONE_REGEX.test(phone)) return null;
  if (!pickup || !destination || !vehicleCategory || !id) return null;
  if (!departure || !DATE_REGEX.test(departure)) return null;
  if (b.trip_type !== "one-way" && b.trip_type !== "round-trip") return null;
  if (email === false || preferred === false || returnDate === false || special === false || createdAt === false) {
    return null;
  }
  if (email && !EMAIL_REGEX.test(email)) return null;
  if (returnDate && !DATE_REGEX.test(returnDate)) return null;
  if (!Number.isInteger(passengers) || passengers < 1 || passengers > 30) return null;
  if (!Number.isInteger(days) || days < 1 || days > 60) return null;
  if (!Number.isInteger(waiting) || waiting < 0 || waiting > 60) return null;

  return {
    id,
    customer_name: customerName,
    phone_number: phone,
    email_address: email,
    trip_type: b.trip_type,
    vehicle_category: vehicleCategory,
    preferred_vehicle: preferred,
    passengers,
    pickup_location: pickup,
    destination,
    departure_date: departure,
    return_date: returnDate,
    number_of_days: days,
    waiting_days: waiting,
    special_requirements: special,
    created_at: createdAt ?? undefined,
  };
}

/**
 * Loads the booking with the caller's own Supabase session. Row-Level Security decides
 * whether the caller may read it, so only the owner/admin account gets a row back.
 */
async function loadBookingAsCaller(
  accessToken: string,
  bookingId: string,
): Promise<BookingEmailPayload | null> {
  if (!isSupabaseConfigured || !UUID_REGEX.test(bookingId)) return null;
  const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await client.auth.getUser(accessToken);
  if (userError || !userData?.user) return null;

  const { data, error } = await client.from("bookings").select("*").eq("id", bookingId).maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id,
    customer_name: data.customer_name,
    phone_number: data.phone_number,
    email_address: data.email_address,
    trip_type: data.trip_type,
    vehicle_category: data.vehicle_category,
    preferred_vehicle: data.preferred_vehicle,
    passengers: data.passengers,
    pickup_location: data.pickup_location,
    destination: data.destination,
    departure_date: data.departure_date,
    return_date: data.return_date,
    number_of_days: data.number_of_days,
    special_requirements: data.special_requirements,
    created_at: data.created_at,
  };
}

async function sendViaResend(
  apiKey: string,
  payload: { from: string; to: string; subject: string; html: string; text: string }
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    let response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let resData: any = {};
    try {
      resData = await response.json();
    } catch {
      // Non-json response
    }

    // Smart fallback: If the custom domain is unverified, fall back to onboarding@resend.dev
    if (
      !response.ok &&
      response.status === 403 &&
      typeof resData?.message === "string" &&
      resData.message.toLowerCase().includes("not verified") &&
      payload.from !== `Rashe Holidays <onboarding@resend.dev>`
    ) {
      console.warn("[Resend] Domain not verified yet. Retrying via onboarding@resend.dev...");
      const fallbackPayload = {
        ...payload,
        from: `Rashe Holidays <onboarding@resend.dev>`,
      };
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fallbackPayload),
      });
      try {
        resData = await response.json();
      } catch {
        // Non-json response
      }
    }

    if (response.ok) {
      return { success: true, id: resData.id };
    }

    return {
      success: false,
      error: resData.message || resData.error || `HTTP ${response.status}`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export const Route = createFileRoute("/api/send-booking-email")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          // Reject cross-site browser requests; the site itself always sends a same-origin Origin.
          const origin = request.headers.get("origin");
          if (origin && origin !== new URL(request.url).origin) {
            return Response.json({ success: false, error: "Forbidden." }, { status: 403 });
          }

          const rawText = await request.text();
          if (rawText.length > MAX_BODY_BYTES) {
            return Response.json({ success: false, error: "Payload too large." }, { status: 413 });
          }

          let rawBody: RawPayload;
          try {
            rawBody = JSON.parse(rawText);
          } catch {
            return Response.json({ success: false, error: "Invalid JSON." }, { status: 400 });
          }

          const requestedType = rawBody?.email_type;
          const emailType: EmailType =
            requestedType === "customer_confirmation" || requestedType === "admin_notification"
              ? requestedType
              : "both";

          // Authenticated (owner) path: booking data comes from the database, never the body,
          // and the customer email can only go to the address stored on that booking.
          const authHeader = request.headers.get("authorization") || "";
          const accessToken = authHeader.toLowerCase().startsWith("bearer ")
            ? authHeader.slice(7).trim()
            : "";
          let body: BookingEmailPayload | null = null;
          let isTrustedBooking = false;
          if (accessToken && typeof rawBody?.id === "string") {
            body = await loadBookingAsCaller(accessToken, rawBody.id);
            isTrustedBooking = body !== null;
          }

          // Unauthenticated fallback path (used when the booking could not be saved to
          // Supabase): only the fixed admin inbox may be notified, never an arbitrary address.
          if (!isTrustedBooking) {
            const ip =
              request.headers.get("cf-connecting-ip") ||
              request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
              "unknown";
            if (isRateLimited(ip)) {
              return Response.json(
                { success: false, error: "Too many requests. Please try again later." },
                { status: 429 },
              );
            }
            body = parsePublicPayload(rawBody);
            if (!body) {
              return Response.json(
                { success: false, error: "Missing or invalid booking details in payload." },
                { status: 400 },
              );
            }
          }
          if (!body) {
            return Response.json({ success: false, error: "Invalid request." }, { status: 400 });
          }

          // Resolve environment variables (works in Node, Nitro, Cloudflare Workers, Vite SSR)
          const resendApiKey =
            (typeof process !== "undefined" && process.env?.RESEND_API_KEY) ||
            "";

          const adminEmail =
            (typeof process !== "undefined" && process.env?.ADMIN_EMAIL) ||
            "rasheholiday@gmail.com";

          const fromEmail =
            (typeof process !== "undefined" && process.env?.RESEND_FROM_EMAIL) ||
            "Rashe Holidays <bookings@rasheholidays.com>";

          const companyName =
            (typeof process !== "undefined" && process.env?.COMPANY_NAME) ||
            EMAIL_COMPANY.name;

          const results: { admin: SendStatus; customer: SendStatus } = {
            admin: { status: "skipped" },
            customer: { status: "skipped" },
          };

          if (!resendApiKey) {
            console.error("[api/send-booking-email] RESEND_API_KEY is not configured.");
            return Response.json(
              { success: false, error: "Email service is not configured." },
              { status: 500 }
            );
          }

          // 1. Dispatch Admin Notification Email to the fixed owner inbox
          if (adminEmail && emailType !== "customer_confirmation") {
            const adminContent = renderAdminNotificationEmail({
              bookingId: body.id,
              customerName: body.customer_name,
              phoneNumber: body.phone_number,
              emailAddress: body.email_address ?? null,
              tripType: body.trip_type,
              vehicleCategory: body.vehicle_category,
              preferredVehicle: body.preferred_vehicle ?? null,
              passengers: body.passengers,
              pickupLocation: body.pickup_location,
              destination: body.destination,
              departureDate: body.departure_date,
              returnDate: body.return_date ?? null,
              numberOfDays: body.number_of_days || 1,
              waitingDays: body.waiting_days,
              specialRequirements: body.special_requirements ?? null,
              createdAt: body.created_at,
              adminPortalUrl: `${EMAIL_COMPANY.adminUrl}`,
            });

            const adminSend = await sendViaResend(resendApiKey, {
              from: fromEmail,
              to: adminEmail.trim(),
              subject: adminContent.subject,
              html: adminContent.html,
              text: adminContent.text,
            });

            results.admin = adminSend.success
              ? { status: "sent", id: adminSend.id || undefined }
              : { status: "failed", error: isTrustedBooking ? adminSend.error : undefined };
          }

          // 2. Customer confirmation: only for bookings verified from the database
          if (
            isTrustedBooking &&
            emailType !== "admin_notification" &&
            body.email_address &&
            body.email_address.trim().length > 0
          ) {
            const customerContent = renderCustomerConfirmationEmail({
              bookingId: body.id,
              customerName: body.customer_name,
              customerEmail: body.email_address,
              customerPhone: body.phone_number,
              tripType: body.trip_type,
              vehicleCategory: body.vehicle_category,
              preferredVehicle: body.preferred_vehicle ?? null,
              passengers: body.passengers,
              pickupLocation: body.pickup_location,
              destination: body.destination,
              departureDate: body.departure_date,
              returnDate: body.return_date ?? null,
              numberOfDays: body.number_of_days || 1,
              waitingDays: body.waiting_days,
              specialRequirements: body.special_requirements ?? null,
              companyName,
            });

            const customerSend = await sendViaResend(resendApiKey, {
              from: fromEmail,
              to: body.email_address.trim(),
              subject: customerContent.subject,
              html: customerContent.html,
              text: customerContent.text,
            });

            results.customer = customerSend.success
              ? { status: "sent", id: customerSend.id || undefined }
              : { status: "failed", error: customerSend.error || undefined };
          }

          console.log("[api/send-booking-email] Summary:", {
            trusted: isTrustedBooking,
            admin: results.admin.status,
            customer: results.customer.status,
          });

          return Response.json({
            success: true,
            message: "Email dispatch processed.",
            results,
          });
        } catch (error: unknown) {
          console.error("[api/send-booking-email] Exception:", error);
          return Response.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
          );
        }
      },
    },
  },
});
