import { createFileRoute } from "@tanstack/react-router";
import { renderCustomerConfirmationEmail } from "@/emails/CustomerConfirmationEmail";
import { renderAdminNotificationEmail } from "@/emails/AdminNotificationEmail";
import { EMAIL_COMPANY } from "@/emails/theme";

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
  created_at?: string;
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
          const body = (await request.json()) as BookingEmailPayload;

          if (!body || !body.customer_name) {
            return Response.json(
              { success: false, error: "Missing required booking details in payload." },
              { status: 400 }
            );
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

          const results: {
            admin: { status: "sent" | "failed" | "skipped"; id?: string; error?: string };
            customer: { status: "sent" | "failed" | "skipped"; id?: string; error?: string };
          } = {
            admin: { status: "skipped" },
            customer: { status: "skipped" },
          };

          if (!resendApiKey) {
            return Response.json(
              { success: false, error: "RESEND_API_KEY is not configured." },
              { status: 500 }
            );
          }

          // 1. Dispatch Admin Notification Email to rasheholiday@gmail.com
          if (adminEmail) {
            const adminContent = renderAdminNotificationEmail({
              bookingId: body.id,
              customerName: body.customer_name,
              phoneNumber: body.phone_number,
              emailAddress: body.email_address,
              tripType: body.trip_type,
              vehicleCategory: body.vehicle_category,
              preferredVehicle: body.preferred_vehicle,
              passengers: body.passengers,
              pickupLocation: body.pickup_location,
              destination: body.destination,
              departureDate: body.departure_date,
              returnDate: body.return_date,
              numberOfDays: body.number_of_days || 1,
              waitingDays: body.waiting_days,
              specialRequirements: body.special_requirements,
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
              ? { status: "sent", id: adminSend.id }
              : { status: "failed", error: adminSend.error };
          }

          // 2. Dispatch Customer Confirmation Email to Sender (the user who entered their email)
          if (body.email_address && body.email_address.trim().length > 0) {
            const customerContent = renderCustomerConfirmationEmail({
              bookingId: body.id,
              customerName: body.customer_name,
              customerEmail: body.email_address,
              customerPhone: body.phone_number,
              tripType: body.trip_type,
              vehicleCategory: body.vehicle_category,
              preferredVehicle: body.preferred_vehicle,
              passengers: body.passengers,
              pickupLocation: body.pickup_location,
              destination: body.destination,
              departureDate: body.departure_date,
              returnDate: body.return_date,
              numberOfDays: body.number_of_days || 1,
              waitingDays: body.waiting_days,
              specialRequirements: body.special_requirements,
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
              ? { status: "sent", id: customerSend.id }
              : { status: "failed", error: customerSend.error };
            console.log(`[api/send-booking-email] Customer (${body.email_address}) result:`, customerSend);
          }

          console.log("[api/send-booking-email] Summary:", results);

          return Response.json({
            success: true,
            message: "Email dispatch processed for both admin and customer.",
            results,
          });
        } catch (error: unknown) {
          const errMessage = error instanceof Error ? error.message : "Internal server error";
          console.error("[api/send-booking-email] Exception:", error);
          return Response.json(
            { success: false, error: errMessage },
            { status: 500 }
          );
        }
      },
    },
  },
});
