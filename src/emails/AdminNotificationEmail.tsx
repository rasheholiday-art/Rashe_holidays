import React from "react";

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

export function AdminNotificationEmail({
  bookingId,
  customerName,
  phoneNumber,
  emailAddress,
  tripType,
  vehicleCategory,
  preferredVehicle,
  passengers,
  pickupLocation,
  destination,
  departureDate,
  returnDate,
  numberOfDays,
  specialRequirements,
  createdAt,
  adminPortalUrl = "https://yourdomain.com/admin",
}: AdminNotificationEmailProps) {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hi ${customerName}, thank you for your booking enquiry #${bookingId.slice(0, 8)} with us!`,
  )}`;

  return (
    <div
      style={{
        backgroundColor: "#f3f4f6",
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
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                backgroundColor: "#0f172a",
                padding: "24px 32px",
                borderBottom: "3px solid #f59e0b",
              }}
            >
              <table width="100%" border={0} cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          color: "#f59e0b",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        New Booking Alert
                      </span>
                      <h1
                        style={{
                          fontSize: "20px",
                          fontWeight: "800",
                          color: "#ffffff",
                          margin: "0",
                        }}
                      >
                        New Travel Booking Received
                      </h1>
                    </td>
                    <td align="right" style={{ verticalAlign: "top" }}>
                      <span
                        style={{
                          backgroundColor: "#1e293b",
                          color: "#94a3b8",
                          fontFamily: "monospace",
                          fontSize: "12px",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: "1px solid #334155",
                        }}
                      >
                        #{bookingId.slice(0, 8)}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td style={{ padding: "32px" }}>
              <div
                style={{
                  backgroundColor: "#eff6ff",
                  border: "1px solid #dbeafe",
                  borderRadius: "12px",
                  padding: "20px 24px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#2563eb",
                    marginBottom: "12px",
                  }}
                >
                  Customer Information
                </div>
                <table width="100%" border={0} cellPadding={0} cellSpacing={0}>
                  <tbody>
                    <Row label="Customer Name" value={customerName} highlight />
                    <Row label="Phone Number" value={phoneNumber} />
                    <Row label="Email" value={emailAddress || "Not provided"} />
                  </tbody>
                </table>

                <div
                  style={{
                    marginTop: "16px",
                    paddingTop: "12px",
                    borderTop: "1px dashed #bfdbfe",
                  }}
                >
                  <a
                    href={`tel:${phoneNumber.replace(/\s+/g, "")}`}
                    style={{
                      display: "inline-block",
                      backgroundColor: "#2563eb",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: "600",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      marginRight: "8px",
                    }}
                  >
                    Call Customer
                  </a>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      backgroundColor: "#16a34a",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: "600",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      textDecoration: "none",
                    }}
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "20px 24px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#6b7280",
                    marginBottom: "12px",
                  }}
                >
                  Trip & Vehicle Details
                </div>
                <table width="100%" border={0} cellPadding={0} cellSpacing={0}>
                  <tbody>
                    <Row
                      label="Trip Type"
                      value={tripType === "one-way" ? "One Way" : "Round Trip"}
                    />
                    <Row label="Vehicle Category" value={vehicleCategory} />
                    <Row label="Preferred Vehicle" value={preferredVehicle || "Any available"} />
                    <Row label="Passengers" value={`${passengers} Travelers`} />
                    <Row label="Pickup Location" value={pickupLocation} />
                    <Row label="Destination" value={destination} />
                    <Row label="Departure Date" value={departureDate} />
                    <Row
                      label="Return Date"
                      value={tripType === "round-trip" && returnDate ? returnDate : "N/A"}
                    />
                    <Row label="Number of Days" value={`${numberOfDays} Days`} />
                    <Row label="Special Requirements" value={specialRequirements || "None"} />
                  </tbody>
                </table>
              </div>

              <div style={{ textAlign: "center", margin: "28px 0 12px 0" }}>
                <a
                  href={adminPortalUrl}
                  style={{
                    display: "inline-block",
                    backgroundColor: "#0f172a",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "600",
                    padding: "12px 28px",
                    borderRadius: "10px",
                    textDecoration: "none",
                  }}
                >
                  Open Booking in Admin Portal
                </a>
              </div>
            </td>
          </tr>

          <tr>
            <td
              style={{
                backgroundColor: "#f9fafb",
                padding: "16px 32px",
                borderTop: "1px solid #e5e7eb",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0" }}>
                Booking ID: {bookingId} {createdAt ? `· Created: ${createdAt}` : ""}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Row({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <tr>
      <td style={{ padding: "7px 0", fontSize: "14px", color: "#6b7280", width: "40%" }}>
        {label}:
      </td>
      <td
        style={{
          padding: "7px 0",
          fontSize: "14px",
          fontWeight: highlight ? "700" : "600",
          color: highlight ? "#1e40af" : "#111827",
          width: "60%",
        }}
      >
        {value}
      </td>
    </tr>
  );
}
