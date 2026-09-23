import React from "react";

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

export function CustomerConfirmationEmail({
  customerName,
  tripType,
  vehicleCategory,
  passengers,
  pickupLocation,
  destination,
  departureDate,
  returnDate,
  companyName = "Rashe Holidays",
}: CustomerConfirmationEmailProps) {
  const formattedTripType = tripType === "one-way" ? "One Way" : "Round Trip";

  return (
    <div
      style={{
        backgroundColor: "#f6f8fa",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        padding: "40px 16px",
        margin: "0",
        color: "#1f2937",
      }}
    >
      <table
        align="center"
        border={0}
        cellPadding={0}
        cellSpacing={0}
        style={{
          maxWidth: "580px",
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
          border: "1px solid #e5e7eb",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                backgroundColor: "#16181b",
                padding: "28px 32px",
                textAlign: "left",
                borderBottom: "3px solid #d99b26",
              }}
            >
              <table width="100%" border={0} cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td>
                      <span
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          color: "#ffffff",
                          letterSpacing: "-0.5px",
                        }}
                      >
                        {companyName}
                      </span>
                    </td>
                    <td align="right">
                      <span
                        style={{
                          backgroundColor: "rgba(217, 155, 38, 0.15)",
                          color: "#d99b26",
                          border: "1px solid rgba(217, 155, 38, 0.3)",
                          padding: "4px 10px",
                          borderRadius: "9999px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        Enquiry Received
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td style={{ padding: "32px" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  margin: "0 0 12px 0",
                  color: "#111827",
                }}
              >
                Hello {customerName},
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "#4b5563",
                  margin: "0 0 8px 0",
                }}
              >
                Thank you for choosing <strong>{companyName}</strong>.
              </p>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "#4b5563",
                  margin: "0 0 24px 0",
                }}
              >
                We have received your booking request.
              </p>

              <div
                style={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "20px 24px",
                  marginBottom: "28px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#9ca3af",
                    marginBottom: "14px",
                  }}
                >
                  Booking Summary
                </div>
                <table width="100%" border={0} cellPadding={0} cellSpacing={0}>
                  <tbody>
                    <Row label="Trip Type" value={formattedTripType} />
                    <Row label="Vehicle" value={vehicleCategory} />
                    <Row label="Passengers" value={`${passengers} Travelers`} />
                    <Row label="Pickup" value={pickupLocation} />
                    <Row label="Destination" value={destination} />
                    <Row label="Departure" value={departureDate} />
                    <Row
                      label="Return"
                      value={tripType === "round-trip" && returnDate ? returnDate : "N/A (One Way)"}
                    />
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  backgroundColor: "#fffbeb",
                  border: "1px solid #fef3c7",
                  borderRadius: "10px",
                  padding: "16px 20px",
                  marginBottom: "28px",
                }}
              >
                <p style={{ fontSize: "14px", lineHeight: "1.5", color: "#92400e", margin: "0" }}>
                  Our team will contact you shortly to confirm availability and pricing.
                </p>
              </div>

              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "#4b5563",
                  margin: "0 0 4px 0",
                }}
              >
                Regards,
              </p>
              <p style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0" }}>
                {companyName}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={{ padding: "6px 0", fontSize: "14px", color: "#6b7280", width: "35%" }}>
        {label}:
      </td>
      <td style={{ padding: "6px 0", fontSize: "14px", fontWeight: "600", color: "#111827" }}>
        {value}
      </td>
    </tr>
  );
}
