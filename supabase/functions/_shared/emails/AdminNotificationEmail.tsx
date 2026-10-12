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

const THEME = {
  primary: "#121517",
  gold: "#d99b26",
  goldDark: "#b87e14",
  goldSoft: "#fdf8ee",
  goldBorder: "#ecd5a0",
  canvas: "#f7f6f2",
  card: "#ffffff",
  border: "#e7e5df",
  textPrimary: "#14181b",
  textSecondary: "#4b5563",
  textMuted: "#6b7280",
  textLight: "#ffffff",
  whatsapp: "#25D366",
  info: "#0284c7",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

/**
 * Generates email HTML and Plain Text strings for Admin Notification
 * Native TypeScript generator compatible with all Edge runtimes (Deno, Cloudflare, Node).
 */
export function renderAdminNotificationEmail(props: AdminNotificationEmailProps): {
  html: string;
  text: string;
  subject: string;
} {
  const isRoundTrip = props.tripType === "round-trip";
  const formattedTripType = isRoundTrip ? "Round Trip" : "One Way";
  const returnStr = isRoundTrip && props.returnDate ? props.returnDate : "N/A";
  const bookingShortId = props.bookingId.slice(0, 8).toUpperCase();
  const cleanPhone = props.phoneNumber.replace(/[^0-9]/g, "");
  const adminUrl = props.adminPortalUrl || "https://rasheholidays.com/admin";

  const waPreFilled = encodeURIComponent(
    `Hello ${props.customerName}, this is Rashe Holidays regarding your booking request #${bookingShortId} (${props.pickupLocation} to ${props.destination}). We'd love to confirm your trip details!`
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${waPreFilled}`;

  const subject = `🚨 New Booking: ${props.customerName} (${formattedTripType} · ${props.pickupLocation} → ${props.destination})`;

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
${props.waitingDays && props.waitingDays > 0 ? `- Waiting Days: ${props.waitingDays} Day(s) (vehicle standby)\n` : ""}- Vehicle Category: ${props.vehicleCategory}
- Preferred Vehicle: ${props.preferredVehicle || "Any available in category"}

${props.specialRequirements ? `SPECIAL REQUIREMENTS:\n"${props.specialRequirements}"\n\n` : ""}QUICK ACTIONS:
- Call Customer: tel:${props.phoneNumber.replace(/\s+/g, "")}
- WhatsApp Chat: ${waUrl}
- Admin Dashboard: ${adminUrl}
`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:${THEME.canvas};font-family:${THEME.fontFamily};-webkit-font-smoothing:antialiased;color:${THEME.textPrimary};">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:${THEME.canvas};padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:${THEME.card};border-radius:18px;overflow:hidden;box-shadow:0 12px 35px rgba(0,0,0,0.06);border:1px solid ${THEME.border};">

          <tr>
            <td style="background-color:${THEME.primary};padding:24px 32px;border-top:4px solid ${THEME.gold};">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:${THEME.gold};display:block;margin-bottom:4px;">
                      ✦ NEW BOOKING ALERT · RASHE HOLIDAYS
                    </span>
                    <h1 style="font-size:20px;font-weight:800;color:${THEME.textLight};margin:0;line-height:1.2;">
                      New Travel Booking Received
                    </h1>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="background-color:#1e2329;color:${THEME.gold};font-family:monospace;font-size:12px;font-weight:700;padding:6px 12px;border-radius:8px;border:1px solid ${THEME.goldBorder};">
                      #${bookingShortId}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 20px 32px;">
              <div style="background-color:${THEME.goldSoft};border:1px solid ${THEME.goldBorder};border-radius:14px;padding:20px 24px;">
                <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:${THEME.goldDark};margin-bottom:12px;">
                  Customer Contact & One-Click Dispatch
                </div>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding:6px 0;font-size:14px;color:${THEME.textSecondary};width:38%;">Customer Name:</td>
                    <td style="padding:6px 0;font-size:16px;font-weight:800;color:${THEME.textPrimary};">${props.customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:14px;color:${THEME.textSecondary};">Phone Number:</td>
                    <td style="padding:6px 0;font-size:15px;font-weight:700;color:${THEME.primary};">
                      <a href="tel:${props.phoneNumber.replace(/\\s+/g, "")}" style="color:${THEME.primary};text-decoration:none;">${props.phoneNumber}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:14px;color:${THEME.textSecondary};">Customer Email:</td>
                    <td style="padding:6px 0;font-size:14px;font-weight:600;color:${THEME.textPrimary};">
                      ${props.emailAddress ? `<a href="mailto:${props.emailAddress}" style="color:${THEME.info};text-decoration:none;">${props.emailAddress}</a>` : '<span style="color:#9ca3af;">Not provided</span>'}
                    </td>
                  </tr>
                </table>

                <div style="margin-top:16px;padding-top:14px;border-top:1px dashed ${THEME.goldBorder};">
                  <a href="tel:${props.phoneNumber.replace(/\\s+/g, "")}" style="display:inline-block;background-color:${THEME.primary};color:#ffffff;font-size:13px;font-weight:700;padding:10px 18px;border-radius:8px;text-decoration:none;margin-right:8px;margin-bottom:6px;">
                    📞 Call Customer
                  </a>
                  <a href="${waUrl}" target="_blank" rel="noreferrer" style="display:inline-block;background-color:${THEME.whatsapp};color:#ffffff;font-size:13px;font-weight:700;padding:10px 18px;border-radius:8px;text-decoration:none;margin-right:8px;margin-bottom:6px;">
                    💬 Chat on WhatsApp
                  </a>
                  ${props.emailAddress ? `
                  <a href="mailto:${props.emailAddress}" style="display:inline-block;background-color:#ffffff;color:${THEME.textPrimary};border:1px solid ${THEME.border};font-size:13px;font-weight:600;padding:9px 16px;border-radius:8px;text-decoration:none;margin-bottom:6px;">
                    ✉️ Send Email
                  </a>` : ""}
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 24px 32px;">
              <div style="border:1px solid ${THEME.border};border-radius:14px;overflow:hidden;background-color:#ffffff;">
                <div style="background-color:#f9fafb;padding:12px 20px;border-bottom:1px solid ${THEME.border};">
                  <span style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:${THEME.textMuted};">
                    Trip Route & Vehicle Specifications
                  </span>
                </div>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding:8px 20px;">
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${THEME.textSecondary};width:40%;border-bottom:1px solid #f3f4f6;">Trip Type:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${formattedTripType}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Pickup Location:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${props.pickupLocation}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Destination:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${props.destination}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Departure Date:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${props.departureDate}</td>
                  </tr>
                  ${
                    isRoundTrip
                      ? `<tr>
                    <td style="padding:10px 0;font-size:14px;color:${THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Return Date:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${returnStr}</td>
                  </tr>`
                      : ""
                  }
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Duration:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${props.numberOfDays} Day(s)</td>
                  </tr>
                  ${
                    props.waitingDays && props.waitingDays > 0
                      ? `<tr>
                    <td style="padding:10px 0;font-size:14px;color:#d97706;border-bottom:1px solid #f3f4f6;">Waiting Days (Parked):</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:800;color:#d97706;text-align:right;border-bottom:1px solid #f3f4f6;">${props.waitingDays} Day(s) (idle / standby)</td>
                  </tr>`
                      : ""
                  }
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Vehicle Category:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${props.vehicleCategory}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Preferred Vehicle:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${props.preferredVehicle || "Any available"}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${THEME.textSecondary};">Passengers:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${EMAIL_THEME.textPrimary};text-align:right;">${props.passengers} Traveler(s)</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          ${
            props.specialRequirements && props.specialRequirements.trim().length > 0
              ? `<tr>
            <td style="padding:0 32px 24px 32px;">
              <div style="background-color:#fffbeb;border:1px solid #fef3c7;border-left:4px solid ${THEME.gold};border-radius:10px;padding:16px 20px;">
                <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:#92400e;margin-bottom:6px;">
                  ⚠️ Customer Notes & Special Requests:
                </div>
                <div style="font-size:14px;line-height:1.5;color:#78350f;">
                  "${props.specialRequirements.trim()}"
                </div>
              </div>
            </td>
          </tr>`
              : ""
          }

          <tr>
            <td style="padding:0 32px 32px 32px;text-align:center;">
              <a href="${adminUrl}" style="display:inline-block;background-color:${THEME.primary};color:#ffffff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;">
                Open Booking in Admin Portal ➔
              </a>
              <div style="font-size:12px;color:${THEME.textMuted};margin-top:12px;">
                Booking ID: ${props.bookingId}
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color:#f9fafb;padding:20px 32px;border-top:1px solid ${THEME.border};text-align:center;">
              <div style="font-size:12px;color:${THEME.textMuted};line-height:1.5;">
                Rashe Holidays Dispatch Alert · Received at ${props.createdAt || new Date().toLocaleString("en-IN")}<br>
                Recipient: <a href="mailto:rasheholiday@gmail.com" style="color:${THEME.goldDark};text-decoration:none;font-weight:600;">rasheholiday@gmail.com</a>
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
