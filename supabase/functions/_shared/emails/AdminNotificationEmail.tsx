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
  specialRequirements?: string | null;
  createdAt?: string;
  adminPortalUrl?: string;
}

/**
 * Generates email HTML and Plain Text strings for Admin Notification
 * Native TypeScript generator compatible with all Edge runtimes (Deno, Cloudflare, Node).
 */
export function renderAdminNotificationEmail(props: AdminNotificationEmailProps): {
  html: string;
  text: string;
  subject: string;
} {
  const subject = "New Travel Booking Received";
  const returnStr = props.tripType === "round-trip" && props.returnDate ? props.returnDate : "N/A";
  const formattedTripType = props.tripType === "one-way" ? "One Way" : "Round Trip";
  const cleanPhone = props.phoneNumber.replace(/[^0-9]/g, "");

  const text = `NEW TRAVEL BOOKING RECEIVED

Booking ID: ${props.bookingId}

CUSTOMER DETAILS:
Customer Name: ${props.customerName}
Phone Number: ${props.phoneNumber}
Email: ${props.emailAddress || "Not provided"}

TRIP DETAILS:
Trip Type: ${formattedTripType}
Vehicle Category: ${props.vehicleCategory}
Preferred Vehicle: ${props.preferredVehicle || "Any available"}
Passengers: ${props.passengers}
Pickup Location: ${props.pickupLocation}
Destination: ${props.destination}
Departure Date: ${props.departureDate}
Return Date: ${returnStr}
Number of Days: ${props.numberOfDays}
Special Requirements: ${props.specialRequirements || "None"}

Admin Portal: ${props.adminPortalUrl || "Check your Supabase Admin Dashboard"}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;">
  <div style="background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;padding:40px 16px;color:#1f2937;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);border:1px solid #e5e7eb;">
      <tbody>
        <tr>
          <td style="background-color:#0f172a;padding:24px 32px;border-bottom:3px solid #f59e0b;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <td>
                    <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#f59e0b;display:block;margin-bottom:4px;">New Booking Alert</span>
                    <h1 style="font-size:20px;font-weight:800;color:#ffffff;margin:0;">New Travel Booking Received</h1>
                  </td>
                  <td align="right" style="vertical-align:top;">
                    <span style="background-color:#1e293b;color:#94a3b8;font-family:monospace;font-size:12px;padding:6px 12px;border-radius:8px;border:1px solid #334155;">#${props.bookingId.slice(0, 8)}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <div style="background-color:#eff6ff;border:1px solid #dbeafe;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#2563eb;margin-bottom:12px;">Customer Information</div>
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                  <tr><td style="padding:7px 0;font-size:14px;color:#6b7280;width:40%;">Customer Name:</td><td style="padding:7px 0;font-size:14px;font-weight:700;color:#1e40af;">${props.customerName}</td></tr>
                  <tr><td style="padding:7px 0;font-size:14px;color:#6b7280;">Phone Number:</td><td style="padding:7px 0;font-size:14px;font-weight:600;color:#111827;">${props.phoneNumber}</td></tr>
                  <tr><td style="padding:7px 0;font-size:14px;color:#6b7280;">Email:</td><td style="padding:7px 0;font-size:14px;font-weight:600;color:#111827;">${props.emailAddress || "Not provided"}</td></tr>
                </tbody>
              </table>
              <div style="margin-top:16px;padding-top:12px;border-top:1px dashed #bfdbfe;">
                <a href="tel:${props.phoneNumber.replace(/\s+/g, "")}" style="display:inline-block;background-color:#2563eb;color:#ffffff;font-size:13px;font-weight:600;padding:8px 16px;border-radius:8px;text-decoration:none;margin-right:8px;">Call Customer</a>
                <a href="https://wa.me/${cleanPhone}" target="_blank" rel="noreferrer" style="display:inline-block;background-color:#16a34a;color:#ffffff;font-size:13px;font-weight:600;padding:8px 16px;border-radius:8px;text-decoration:none;">Chat on WhatsApp</a>
              </div>
            </div>

            <div style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;margin-bottom:12px;">Trip & Vehicle Details</div>
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                  <tr><td style="padding:7px 0;font-size:14px;color:#6b7280;width:40%;">Trip Type:</td><td style="padding:7px 0;font-size:14px;font-weight:600;color:#111827;">${formattedTripType}</td></tr>
                  <tr><td style="padding:7px 0;font-size:14px;color:#6b7280;">Vehicle Category:</td><td style="padding:7px 0;font-size:14px;font-weight:600;color:#111827;">${props.vehicleCategory}</td></tr>
                  <tr><td style="padding:7px 0;font-size:14px;color:#6b7280;">Preferred Vehicle:</td><td style="padding:7px 0;font-size:14px;font-weight:600;color:#111827;">${props.preferredVehicle || "Any available"}</td></tr>
                  <tr><td style="padding:7px 0;font-size:14px;color:#6b7280;">Passengers:</td><td style="padding:7px 0;font-size:14px;font-weight:600;color:#111827;">${props.passengers} Travelers</td></tr>
                  <tr><td style="padding:7px 0;font-size:14px;color:#6b7280;">Pickup Location:</td><td style="padding:7px 0;font-size:14px;font-weight:600;color:#111827;">${props.pickupLocation}</td></tr>
                  <tr><td style="padding:7px 0;font-size:14px;color:#6b7280;">Destination:</td><td style="padding:7px 0;font-size:14px;font-weight:600;color:#111827;">${props.destination}</td></tr>
                  <tr><td style="padding:7px 0;font-size:14px;color:#6b7280;">Departure Date:</td><td style="padding:7px 0;font-size:14px;font-weight:600;color:#111827;">${props.departureDate}</td></tr>
                  <tr><td style="padding:7px 0;font-size:14px;color:#6b7280;">Return Date:</td><td style="padding:7px 0;font-size:14px;font-weight:600;color:#111827;">${returnStr}</td></tr>
                  <tr><td style="padding:7px 0;font-size:14px;color:#6b7280;">Number of Days:</td><td style="padding:7px 0;font-size:14px;font-weight:600;color:#111827;">${props.numberOfDays} Days</td></tr>
                  <tr><td style="padding:7px 0;font-size:14px;color:#6b7280;">Special Requirements:</td><td style="padding:7px 0;font-size:14px;font-weight:600;color:#111827;">${props.specialRequirements || "None"}</td></tr>
                </tbody>
              </table>
            </div>

            <div style="text-align:center;margin:28px 0 12px 0;">
              <a href="${props.adminPortalUrl || "#"}" style="display:inline-block;background-color:#0f172a;color:#ffffff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:10px;text-decoration:none;">Open Booking in Admin Portal</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="font-size:12px;color:#9ca3af;margin:0;">Booking ID: ${props.bookingId}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>`;

  return { html, text, subject };
}
