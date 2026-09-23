export interface CustomerConfirmationEmailProps {
  customerName: string;
  tripType: string;
  vehicleCategory: string;
  passengers: number;
  pickupLocation: string;
  destination: string;
  departureDate: string;
  returnDate?: string | null;
  companyName?: string;
}

/**
 * Generates email HTML and Plain Text strings for Customer Confirmation
 * Native TypeScript generator compatible with all Edge runtimes (Deno, Cloudflare, Node).
 */
export function renderCustomerConfirmationEmail(props: CustomerConfirmationEmailProps): {
  html: string;
  text: string;
  subject: string;
} {
  const company = props.companyName || "Rashe Holidays";
  const subject = `Booking Request Received - ${company}`;
  const returnStr = props.tripType === "round-trip" && props.returnDate ? props.returnDate : "N/A";
  const formattedTripType = props.tripType === "one-way" ? "One Way" : "Round Trip";

  const text = `Hello ${props.customerName},

Thank you for choosing ${company}.

We have received your booking request.

Booking Summary:

Trip Type: ${formattedTripType}
Vehicle: ${props.vehicleCategory}
Passengers: ${props.passengers}
Pickup: ${props.pickupLocation}
Destination: ${props.destination}
Departure: ${props.departureDate}
Return: ${returnStr}

Our team will contact you shortly to confirm availability and pricing.

Regards,
${company}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f8fa;">
  <div style="background-color:#f6f8fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;padding:40px 16px;color:#1f2937;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.05);border:1px solid #e5e7eb;">
      <tbody>
        <tr>
          <td style="background-color:#16181b;padding:28px 32px;border-bottom:3px solid #d99b26;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <td><span style="font-size:20px;font-weight:bold;color:#ffffff;letter-spacing:-0.5px;">${company}</span></td>
                  <td align="right"><span style="background-color:rgba(217,155,38,0.15);color:#d99b26;border:1px solid rgba(217,155,38,0.3);padding:4px 10px;border-radius:9999px;font-size:12px;font-weight:600;">Enquiry Received</span></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h2 style="font-size:20px;font-weight:700;margin:0 0 12px 0;color:#111827;">Hello ${props.customerName},</h2>
            <p style="font-size:15px;line-height:1.6;color:#4b5563;margin:0 0 8px 0;">Thank you for choosing <strong>${company}</strong>.</p>
            <p style="font-size:15px;line-height:1.6;color:#4b5563;margin:0 0 24px 0;">We have received your booking request.</p>
            <div style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
              <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#9ca3af;margin-bottom:14px;">Booking Summary</div>
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                  <tr><td style="padding:6px 0;font-size:14px;color:#6b7280;width:35%;">Trip Type:</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;">${formattedTripType}</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#6b7280;">Vehicle:</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;">${props.vehicleCategory}</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#6b7280;">Passengers:</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;">${props.passengers} Travelers</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#6b7280;">Pickup:</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;">${props.pickupLocation}</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#6b7280;">Destination:</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;">${props.destination}</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#6b7280;">Departure:</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;">${props.departureDate}</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#6b7280;">Return:</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;">${returnStr}</td></tr>
                </tbody>
              </table>
            </div>
            <div style="background-color:#fffbeb;border:1px solid #fef3c7;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
              <p style="font-size:14px;line-height:1.5;color:#92400e;margin:0;">Our team will contact you shortly to confirm availability and pricing.</p>
            </div>
            <p style="font-size:15px;line-height:1.6;color:#4b5563;margin:0 0 4px 0;">Regards,</p>
            <p style="font-size:16px;font-weight:700;color:#111827;margin:0;">${company}</p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="font-size:12px;color:#9ca3af;margin:0;line-height:1.5;">This is an automated confirmation of your booking enquiry from ${company}.</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>`;

  return { html, text, subject };
}
