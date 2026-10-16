import { escapeHtml, escapeHtmlProps } from "./escape.ts";

export interface CustomerConfirmationEmailProps {
  customerName: string;
  tripType: string;
  vehicleCategory: string;
  preferredVehicle?: string | null;
  passengers: number;
  pickupLocation: string;
  destination: string;
  departureDate: string;
  returnDate?: string | null;
  numberOfDays?: number | null;
  waitingDays?: number | null;
  estimatedPrice?: string | null;
  specialRequirements?: string | null;
  companyName?: string;
  bookingId?: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
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
  success: "#16a34a",
  whatsapp: "#25D366",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

const COMPANY = {
  name: "Rashe Holidays",
  tagline: "Premium Travels & Transportation · Ooty",
  phone: "+91 97869 63659",
  cleanPhone: "919786963659",
  address: "12, Commercial Road, Near Charring Cross, Ooty, The Nilgiris, Tamil Nadu 643001",
  siteUrl: "https://rasheholidays.com",
};

/**
 * Generates email HTML and Plain Text strings for Customer Confirmation.
 * Native TypeScript generator compatible with all Edge runtimes (Deno, Cloudflare, Node).
 */
export function renderCustomerConfirmationEmail(props: CustomerConfirmationEmailProps): {
  html: string;
  text: string;
  subject: string;
} {
  const company = props.companyName || COMPANY.name;
  const isRoundTrip = props.tripType === "round-trip";
  const formattedTripType = isRoundTrip ? "Round Trip" : "One Way";
  const returnStr = isRoundTrip && props.returnDate ? props.returnDate : "N/A";
  const daysStr = props.numberOfDays && props.numberOfDays > 1 ? `${props.numberOfDays} Days` : "1 Day";
  const bookingRef = props.bookingId ? props.bookingId.slice(0, 8).toUpperCase().replace(/[^A-Z0-9-]/g, "") : "PENDING";
  const cleanPhone = COMPANY.cleanPhone;
  const waPreFilled = encodeURIComponent(
    `Hi ${company}, I recently submitted booking enquiry #${bookingRef} for ${props.pickupLocation} to ${props.destination}. Please confirm availability.`
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${waPreFilled}`;

  const subject = `Booking Request Received — ${company} (#${bookingRef})`;

  const text = `Hello ${props.customerName},

Thank you for choosing ${company}! We have received your travel enquiry.

BOOKING REFERENCE: #${bookingRef}

TRIP SUMMARY:
- Route: ${props.pickupLocation} → ${props.destination}${isRoundTrip ? ` → ${props.pickupLocation}` : ""}
- Trip Type: ${formattedTripType}
- Departure Date: ${props.departureDate}
${isRoundTrip ? `- Return Date: ${returnStr}\n` : ""}- Total Duration: ${daysStr}
${props.waitingDays && props.waitingDays > 0 ? `- Waiting Days: ${props.waitingDays} Day(s) (vehicle standby)\n` : ""}- Vehicle Category: ${props.vehicleCategory}
- Preferred Vehicle: ${props.preferredVehicle || "Any available in category"}
- Passengers: ${props.passengers} Traveler(s)
${props.specialRequirements ? `- Special Requirements: ${props.specialRequirements}\n` : ""}
WHAT HAPPENS NEXT:
1. Our dispatch team is reviewing vehicle availability and route timings.
2. We will contact you shortly via Call or WhatsApp to confirm your booking and final pricing.
3. Your driver details and cab registration number will be shared before departure.

NEED ASSISTANCE?
- WhatsApp: https://wa.me/${cleanPhone}
- Phone: ${COMPANY.phone}
- Address: ${COMPANY.address}
- Hours: 24 Hours / 7 Days a Week

Warm regards,
${company} Team
${COMPANY.siteUrl}
`;

  const h = escapeHtmlProps(props);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${THEME.canvas};font-family:${THEME.fontFamily};-webkit-font-smoothing:antialiased;color:${THEME.textPrimary};">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:${THEME.canvas};padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:${THEME.card};border-radius:18px;overflow:hidden;box-shadow:0 12px 35px rgba(0,0,0,0.06);border:1px solid ${THEME.border};">

          <tr>
            <td style="background-color:${THEME.primary};padding:26px 32px;border-top:4px solid ${THEME.gold};">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="font-size:22px;font-weight:800;color:${THEME.textLight};letter-spacing:-0.5px;line-height:1.2;">
                      <span style="color:${THEME.gold};font-size:24px;vertical-align:middle;margin-right:6px;">✦</span>${escapeHtml(company)}
                    </div>
                    <div style="font-size:12px;color:#9ca3af;margin-top:4px;letter-spacing:0.5px;text-transform:uppercase;">
                      ${COMPANY.tagline}
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;background-color:rgba(217,155,38,0.18);color:${THEME.gold};border:1px solid ${THEME.gold};padding:6px 14px;border-radius:9999px;font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">
                      Enquiry Received
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 32px 20px 32px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <h1 style="margin:0 0 10px 0;font-size:22px;font-weight:800;color:${THEME.textPrimary};line-height:1.3;">
                      Hello ${h.customerName},
                    </h1>
                    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:${THEME.textSecondary};">
                      Thank you for choosing <strong>${escapeHtml(company)}</strong>. We have received your travel enquiry and our Nilgiris tour planning team is currently checking cab availability and route timing.
                    </p>
                    <div style="display:inline-block;background-color:${THEME.goldSoft};border:1px solid ${THEME.goldBorder};border-radius:8px;padding:6px 14px;font-size:12px;font-weight:700;color:${THEME.goldDark};letter-spacing:0.5px;">
                      BOOKING REFERENCE: #${bookingRef}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 24px 32px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background:linear-gradient(135deg, #1b1f24 0%, #121517 100%);border-radius:14px;padding:20px 24px;border:1px solid #2a2f35;">
                <tr>
                  <td>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="width:42%;vertical-align:middle;">
                          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${THEME.gold};">Pickup</div>
                          <div style="font-size:16px;font-weight:700;color:#ffffff;margin-top:2px;">${h.pickupLocation}</div>
                        </td>
                        <td align="center" style="width:16%;vertical-align:middle;text-align:center;">
                          <div style="font-size:20px;color:${THEME.gold};line-height:1;">➔</div>
                          <div style="font-size:10px;font-weight:600;color:#9ca3af;margin-top:2px;text-transform:uppercase;">${formattedTripType}</div>
                        </td>
                        <td align="right" style="width:42%;vertical-align:middle;text-align:right;">
                          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${THEME.gold};">Destination</div>
                          <div style="font-size:16px;font-weight:700;color:#ffffff;margin-top:2px;">${h.destination}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 24px 32px;">
              <div style="border:1px solid ${THEME.border};border-radius:14px;overflow:hidden;background-color:#ffffff;">
                <div style="background-color:#f9fafb;padding:12px 20px;border-bottom:1px solid ${THEME.border};">
                  <span style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:${THEME.textMuted};">
                    Trip Summary & Vehicle Specs
                  </span>
                </div>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding:8px 20px;">
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${THEME.textSecondary};width:45%;border-bottom:1px solid #f3f4f6;">Trip Type:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${formattedTripType}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Departure Date:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${h.departureDate}</td>
                  </tr>
                  ${
                    isRoundTrip
                      ? `<tr>
                    <td style="padding:10px 0;font-size:14px;color:${THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Return Date:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${escapeHtml(returnStr)}</td>
                  </tr>`
                      : ""
                  }
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Total Duration:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${escapeHtml(daysStr)}</td>
                  </tr>
                  ${
                    h.waitingDays && h.waitingDays > 0
                      ? `<tr>
                    <td style="padding:10px 0;font-size:14px;color:#d97706;border-bottom:1px solid #f3f4f6;">Waiting Days (Parked):</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:#d97706;text-align:right;border-bottom:1px solid #f3f4f6;">${h.waitingDays} Day(s) (idle / standby)</td>
                  </tr>`
                      : ""
                  }
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Vehicle Category:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${h.vehicleCategory}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${THEME.textSecondary};border-bottom:1px solid #f3f4f6;">Preferred Vehicle:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${THEME.textPrimary};text-align:right;border-bottom:1px solid #f3f4f6;">${h.preferredVehicle || "Any available"}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:${THEME.textSecondary};">Passengers:</td>
                    <td style="padding:10px 0;font-size:14px;font-weight:700;color:${THEME.textPrimary};text-align:right;">${h.passengers} Traveler(s)</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          ${
            h.specialRequirements && h.specialRequirements.trim().length > 0
              ? `<tr>
            <td style="padding:0 32px 24px 32px;">
              <div style="background-color:${THEME.goldSoft};border:1px solid ${THEME.goldBorder};border-radius:12px;padding:16px 20px;">
                <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:${THEME.goldDark};margin-bottom:6px;">
                  Your Special Requests & Notes:
                </div>
                <div style="font-size:14px;color:${THEME.textPrimary};line-height:1.5;font-style:italic;">
                  "${h.specialRequirements.trim()}"
                </div>
              </div>
            </td>
          </tr>`
              : ""
          }

          <tr>
            <td style="padding:0 32px 28px 32px;">
              <div style="background-color:#fafafa;border:1px solid ${THEME.border};border-radius:14px;padding:20px 24px;">
                <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:${THEME.textMuted};margin-bottom:14px;">
                  What Happens Next
                </div>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="width:28px;vertical-align:top;padding-bottom:14px;">
                      <div style="width:22px;height:22px;border-radius:50%;background-color:${THEME.success};color:#ffffff;font-size:12px;font-weight:bold;text-align:center;line-height:22px;">✓</div>
                    </td>
                    <td style="padding-bottom:14px;padding-left:10px;vertical-align:top;">
                      <div style="font-size:13px;font-weight:700;color:${THEME.textPrimary};">Step 1: Request Logged</div>
                      <div style="font-size:12px;color:${THEME.textSecondary};margin-top:2px;">Your travel inquiry is queued in our 24/7 central desk.</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="width:28px;vertical-align:top;padding-bottom:14px;">
                      <div style="width:22px;height:22px;border-radius:50%;background-color:${THEME.gold};color:#ffffff;font-size:12px;font-weight:bold;text-align:center;line-height:22px;">2</div>
                    </td>
                    <td style="padding-bottom:14px;padding-left:10px;vertical-align:top;">
                      <div style="font-size:13px;font-weight:700;color:${THEME.textPrimary};">Step 2: Availability & Quote Confirmation</div>
                      <div style="font-size:12px;color:${THEME.textSecondary};margin-top:2px;">Our team will call or WhatsApp you shortly to confirm timings and pricing.</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="width:28px;vertical-align:top;">
                      <div style="width:22px;height:22px;border-radius:50%;background-color:#e5e7eb;color:#6b7280;font-size:12px;font-weight:bold;text-align:center;line-height:22px;">3</div>
                    </td>
                    <td style="padding-left:10px;vertical-align:top;">
                      <div style="font-size:13px;font-weight:700;color:${THEME.textPrimary};">Step 3: Driver & Cab Allocation</div>
                      <div style="font-size:12px;color:${THEME.textSecondary};margin-top:2px;">Chauffeur phone number and vehicle details will be sent prior to departure.</div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 32px 32px;text-align:center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${waUrl}" target="_blank" rel="noreferrer" style="display:inline-block;background-color:${THEME.whatsapp};color:#ffffff;font-size:14px;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;margin:0 6px 10px 6px;">
                      💬 Chat with Us on WhatsApp
                    </a>
                    <a href="tel:${COMPANY.phone.replace(/\\s+/g, "")}" style="display:inline-block;background-color:${THEME.primary};color:#ffffff;font-size:14px;font-weight:700;padding:14px 24px;border-radius:10px;text-decoration:none;margin:0 6px 10px 6px;">
                      📞 Call 24×7: ${COMPANY.phone}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color:#f9fafb;padding:26px 32px;border-top:1px solid ${THEME.border};text-align:center;">
              <div style="font-size:13px;font-weight:700;color:${THEME.textPrimary};margin-bottom:4px;">
                ${escapeHtml(company)}
              </div>
              <div style="font-size:12px;color:${THEME.textMuted};line-height:1.5;">
                ${COMPANY.address}<br>
                24×7 Helpline: <a href="tel:${COMPANY.phone.replace(/\\s+/g, "")}" style="color:${THEME.goldDark};text-decoration:none;font-weight:600;">${COMPANY.phone}</a> ·
                Website: <a href="${COMPANY.siteUrl}" style="color:${THEME.goldDark};text-decoration:none;font-weight:600;">rasheholidays.com</a>
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
