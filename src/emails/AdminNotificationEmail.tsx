import React from "react";
import { EMAIL_THEME, EMAIL_COMPANY } from "./theme";
import { escapeHtml, escapeHtmlProps } from "./escape";

export interface AdminNotificationEmailProps {
  bookingId: string;
  customerName: string;
  phoneNumber: string;
  emailAddress?: string | null;
  tripType: string;
  vehicleCategory: string;
  preferredVehicle?: string | null;
  passengers: number;
  pickupLocation: string;
  destination: string;
  departureDate: string;
  returnDate?: string | null;
  numberOfDays: number;
  waitingDays?: number | null;
  specialRequirements?: string | null;
  createdAt?: string;
  adminPortalUrl?: string;
}

/**
 * Generates an email HTML and Plain Text string for Admin Notification.
 * Clean, actionable design highlighting customer contact details and quick-action buttons.
 */
export function renderAdminNotificationEmail(props: AdminNotificationEmailProps): {
  html: string;
  text: string;
  subject: string;
} {
  const isRoundTrip = props.tripType === "round-trip";
  const formattedTripType = isRoundTrip ? "Round Trip" : "One Way";
  const returnStr = isRoundTrip && props.returnDate ? props.returnDate : "N/A";
  const bookingShortId = props.bookingId.slice(0, 8).toUpperCase().replace(/[^A-Z0-9-]/g, "");
  const cleanPhone = props.phoneNumber.replace(/[^0-9]/g, "");
  const adminUrl = props.adminPortalUrl || EMAIL_COMPANY.adminUrl;

  const waPreFilled = encodeURIComponent(
    `Hello ${props.customerName}, this is Rashe Holidays regarding your booking request #${bookingShortId} (${props.pickupLocation} to ${props.destination}). We'd love to confirm your trip details!`
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${waPreFilled}`;

  const subject = `🚨 New Booking: ${props.customerName} (${formattedTripType} · ${props.pickupLocation} → ${props.destination})`;

  // Plain text version
  const text = `NEW BOOKING ENQUIRY RECEIVED
=========================================
Booking ID: #${bookingShortId}
Timestamp: ${props.createdAt || new Date().toLocaleString("en-IN")}

CUSTOMER INFORMATION:
- Name: ${props.customerName}
- Phone: ${props.phoneNumber}
- Email: ${props.emailAddress || "Not provided"}
- Passengers: ${props.passengers} Traveler(s)

TRIP & VEHICLE DETAILS:
- Route: ${props.pickupLocation} → ${props.destination}${isRoundTrip ? ` → ${props.pickupLocation}` : ""}
- Trip Type: ${formattedTripType}
- Departure: ${props.departureDate}
${isRoundTrip ? `- Return: ${returnStr}\n` : ""}- Duration: ${props.numberOfDays} Day(s)
${props.waitingDays && props.waitingDays > 0 ? `- Waiting Days: ${props.waitingDays} Day(s) (vehicle idle/standby)\n` : ""}- Vehicle Category: ${props.vehicleCategory}
- Preferred Vehicle: ${props.preferredVehicle || "Any available in category"}

${props.specialRequirements ? `SPECIAL REQUIREMENTS:\n"${props.specialRequirements}"\n\n` : ""}QUICK ACTIONS:
- Call Customer: tel:${props.phoneNumber.replace(/\s+/g, "")}
- WhatsApp Chat: ${waUrl}
- Admin Dashboard: ${adminUrl}
`;

  // HTML email template
  const h = escapeHtmlProps(props);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${EMAIL_THEME.canvas};font-family:${EMAIL_THEME.fontFamily};-webkit-font-smoothing:antialiased;color:${EMAIL_THEME.textPrimary};">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:${EMAIL_THEME.canvas};padding:32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:${EMAIL_THEME.card};border-radius:18px;overflow:hidden;box-shadow:0 12px 35px rgba(0,0,0,0.06);border:1px solid ${EMAIL_THEME.border};">

          <!-- 1. Header Banner -->
          <tr>
            <td style="background-color:${EMAIL_THEME.primary};padding:24px 32px;border-top:4px solid ${EMAIL_THEME.gold};">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:${EMAIL_THEME.gold};display:block;margin-bottom:4px;">
                      ✦ NEW BOOKING ALERT · RASHE HOLIDAYS
                    </span>
                    <h1 style="font-size:20px;font-weight:800;color:${EMAIL_THEME.textLight};margin:0;line-height:1.2;">
                      New Travel Booking Received
                    </h1>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="background-color:#1e2329;color:${EMAIL_THEME.gold};font-family:monospace;font-size:12px;font-weight:700;padding:6px 12px;border-radius:8px;border:1px solid ${EMAIL_THEME.goldBorder};">
                      #${bookingShortId}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. Immediate Customer Action Bar (Call / WhatsApp / Email) -->
          <tr>
            <td style="padding:28px 32px 20px 32px;">
              <div style="background-color:${EMAIL_THEME.goldSoft};border:1px solid ${EMAIL_THEME.goldBorder};border-radius:14px;padding:20px 24px;">
                <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:${EMAIL_THEME.goldDark};margin-bottom:12px;">
                  Customer Contact & One-Click Dispatch
                </div>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding:6px 0;font-size:14px;color:${EMAIL_THEME.textSecondary};width:38%;">Customer Name:</td>
                    <td style="padding:6px 0;font-size:16px;font-weight:800;color:${EMAIL_THEME.textPrimary};">${h.customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:14px;color:${EMAIL_THEME.textSecondary};">Phone Number:</td>
                    <td style="padding:6px 0;font-size:15px;font-weight:700;color:${EMAIL_THEME.primary};">
                      <a href="tel:${h.phoneNumber.replace(/\\s+/g, "")}" style="color:${EMAIL_THEME.primary};text-decoration:none;">${h.phoneNumber}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:14px;color:${EMAIL_THEME.textSecondary};">Customer Email:</td>
                    <td style="padding:6px 0;font-size:14px;font-weight:600;color:${EMAIL_THEME.textPrimary};">
                      ${h.emailAddress ? `<a href="mailto:${h.emailAddress}" style="color:${EMAIL_THEME.info};text-decoration:none;">${h.emailAddress}</a>` : '<span style="color:#9ca3af;">Not provided</span>'}
                    </td>
                  </tr>
                </table>

                <!-- Action buttons -->
                <div style="margin-top:16px;padding-top:14px;border-top:1px dashed ${EMAIL_THEME.goldBorder};">
                  <a href="tel:${h.phoneNumber.replace(/\\s+/g, "")}" style="display:inline-block;background-color:${EMAIL_THEME.primary};color:#ffffff;font-size:13px;font-weight:700;padding:10px 18px;border-radius:8px;text-decoration:none;margin-right:8px;margin-bottom:6px;">
                    📞 Call Customer
                  </a>
                  <a href="${waUrl}" target="_blank" rel="noreferrer" style="display:inline-block;background-color:${EMAIL_THEME.whatsapp};color:#ffffff;font-size:13px;font-weight:700;padding:10px 18px;border-radius:8px;text-decoration:none;margin-right:8px;margin-bottom:6px;">
                    💬 Chat on WhatsApp
                  </a>
                  ${h.emailAddress ? `
                  <a href="mailto:${h.emailAddress}" style="display:inline-block;background-color:#ffffff;color:${EMAIL_THEME.textPrimary};border:1px solid ${EMAIL_THEME.border};font-size:13px;font-weight:600;padding:9px 16px;border-radius:8px;text-decoration:none;margin-bottom:6px;">
                    ✉️ Send Email
                  </a>` : ""}
                </div>
              </div>
            </td>
          </tr>

          <!-- 3. Trip & Vehicle Information -->
          <tr>
            <td style="padding:0 32px 24px 32px;">
              <div style="border:1px solid ${EMAIL_THEME.border};border-radius:14px;overflow:hidden;background-color:#ffffff;">
                <div style="background-color:#f9fafb;padding:12px 20px;border-bottom:1px solid ${EMAIL_THEME.border};">
                  <span style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:${EMAIL_THEME.textMuted};">
                    Trip Route & Vehicle Specifications
                  </span>
                </div>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding:8px 20px;">
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${EMAIL_THEME.textSecondary};width:40%;border-bottom:1px solid #f3f4f6;">Trip Type:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${EMAIL_THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${formattedTripType}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${EMAIL_THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Pickup Location:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${EMAIL_THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${h.pickupLocation}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${EMAIL_THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Destination:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${EMAIL_THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${h.destination}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${EMAIL_THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Departure Date:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${EMAIL_THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${h.departureDate}</td>
                  </tr>
                  ${
                    isRoundTrip
                      ? `<tr>
                    <td style="padding:10px 0;font-size:14px;color:${EMAIL_THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Return Date:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${EMAIL_THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${escapeHtml(returnStr)}</td>
                  </tr>`
                      : ""
                  }
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${EMAIL_THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Duration:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${EMAIL_THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${h.numberOfDays} Day(s)</td>
                  </tr>
                  ${
                    h.waitingDays && h.waitingDays > 0
                      ? `<tr>
                    <td style="padding:10px 0;font-size:14px;color:#d97706;border-bottom:1px solid #f3f4f6;">Waiting Days (Parked):</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:800;color:#d97706;text-align:right;border-bottom:1px solid #f3f4f6;">${h.waitingDays} Day(s) (idle / standby)</td>
                  </tr>`
                      : ""
                  }
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${EMAIL_THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Vehicle Category:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${EMAIL_THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${h.vehicleCategory}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${EMAIL_THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Preferred Vehicle:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${EMAIL_THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${h.preferredVehicle || "Any available"}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${EMAIL_THEME.textSecondary};">Passengers:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${EMAIL_THEME.textPrimary};text-align:right;">${h.passengers} Traveler(s)</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- 4. Special Requirements Callout -->
          ${
            h.specialRequirements && h.specialRequirements.trim().length > 0
              ? `<tr>
            <td style="padding:0 32px 24px 32px;">
              <div style="background-color:#fffbeb;border:1px solid #fef3c7;border-left:4px solid ${EMAIL_THEME.gold};border-radius:10px;padding:16px 20px;">
                <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:#92400e;margin-bottom:6px;">
                  ⚠️ Customer Notes & Special Requests:
                </div>
                <div style="font-size:14px;line-height:1.5;color:#78350f;">
                  "${h.specialRequirements.trim()}"
                </div>
              </div>
            </td>
          </tr>`
              : ""
          }

          <!-- 5. Dispatch / Operations Checklist -->
          <tr>
            <td style="padding:0 32px 24px 32px;">
              <div style="background-color:#fafafa;border:1px solid ${EMAIL_THEME.border};border-radius:12px;padding:16px 20px;">
                <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:${EMAIL_THEME.textMuted};margin-bottom:10px;">
                  Dispatcher Quick Checklist
                </div>
                <div style="font-size:13px;color:${EMAIL_THEME.textSecondary};line-height:1.7;">
                  ☐ Check fleet availability (Sedan / Crysta / Traveller)<br>
                  ☐ Calculate interstate toll & border permit (if applicable)<br>
                  ☐ Contact customer to confirm timing & advance payment
                </div>
              </div>
            </td>
          </tr>

          <!-- 6. Admin Portal CTA -->
          <tr>
            <td style="padding:0 32px 32px 32px;text-align:center;">
              <a href="${adminUrl}" style="display:inline-block;background-color:${EMAIL_THEME.primary};color:#ffffff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,0.15);">
                Open Booking in Admin Portal ➔
              </a>
              <div style="font-size:12px;color:${EMAIL_THEME.textMuted};margin-top:12px;">
                Booking ID: ${h.bookingId}
              </div>
            </td>
          </tr>

          <!-- 7. Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px 32px;border-top:1px solid ${EMAIL_THEME.border};text-align:center;">
              <div style="font-size:12px;color:${EMAIL_THEME.textMuted};line-height:1.5;">
                Rashe Holidays Dispatch Alert · Received at ${h.createdAt || new Date().toLocaleString("en-IN")}<br>
                Recipient: <a href="mailto:rasheholiday@gmail.com" style="color:${EMAIL_THEME.goldDark};text-decoration:none;font-weight:600;">rasheholiday@gmail.com</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { html, text, subject };
}

/**
 * React Component for email preview / in-browser rendering
 */
export function AdminNotificationEmail(props: AdminNotificationEmailProps) {
  const rendered = renderAdminNotificationEmail(props);
  return <div dangerouslySetInnerHTML={{ __html: rendered.html }} />;
}
