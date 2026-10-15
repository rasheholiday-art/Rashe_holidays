import {
  createBooking as createSupabaseBooking,
  getAllBookings as getSupabaseBookings,
  updateBookingStatus as updateSupabaseBookingStatus,
  deleteBooking as deleteSupabaseBooking,
  getBooking as getSupabaseBooking,
  dispatchBookingEmails,
} from "@/lib/api/bookings";
import type {
  Booking as SupabaseBooking,
  BookingStatus as SupabaseBookingStatus,
} from "@/types/booking";

export type BookingStatus = "New" | "Contacted" | "Confirmed" | "Completed" | "Cancelled";

export interface Reservation {
  id: string;
  createdAt: string; // ISO string
  tripType: "one-way" | "round-trip";
  category: string;
  vehicle?: string | undefined;
  from: string;
  to: string;
  date: string;
  returnDate?: string | undefined;
  passengers: number;
  days: number;
  waitingDays?: number;
  name: string;
  phone: string;
  email?: string | undefined;
  notes?: string | undefined;
  estimate?:
    | {
        low: number;
        high: number;
        km: number;
        days: number;
        waitingDays?: number;
        travelDays?: number;
        tollNote?: string;
      }
    | null
    | undefined;
  status: BookingStatus;
  internalNotes?: string | undefined;
  isSyncedToSupabase?: boolean;
}

const STORAGE_KEY = "nilgiri_rides_reservations";

const SEED_RESERVATIONS: Reservation[] = [];

export function getBookings(): Reservation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as Reservation[];
    // Filter out any legacy sample demo records so only real live bookings appear
    return parsed.filter((b) => !["NR-1048", "NR-1047", "NR-1046", "NR-1045", "NR-1044"].includes(b.id));
  } catch (err) {
    console.error("Failed to parse stored bookings:", err);
    return [];
  }
}

export function mapSupabaseStatusToUi(status: SupabaseBookingStatus): BookingStatus {
  switch (status) {
    case "pending":
      return "New";
    case "contacted":
      return "Contacted";
    case "confirmed":
      return "Confirmed";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return "New";
  }
}

export function mapUiStatusToSupabase(status: BookingStatus): SupabaseBookingStatus {
  switch (status) {
    case "New":
      return "pending";
    case "Contacted":
      return "contacted";
    case "Confirmed":
      return "confirmed";
    case "Completed":
      return "completed";
    case "Cancelled":
      return "cancelled";
    default:
      return "pending";
  }
}

export function mapSupabaseToReservation(b: SupabaseBooking): Reservation {
  return {
    id: b.id,
    createdAt: b.createdAt,
    tripType: b.tripType,
    category: b.vehicleCategory,
    vehicle: b.preferredVehicle || undefined,
    from: b.pickupLocation,
    to: b.destination,
    date: b.departureDate,
    returnDate: b.returnDate || undefined,
    passengers: b.passengers,
    days: b.numberOfDays,
    waitingDays: b.waitingDays ?? 0,
    name: b.customerName,
    phone: b.phoneNumber,
    email: b.emailAddress || undefined,
    notes: b.specialRequirements || undefined,
    status: mapSupabaseStatusToUi(b.bookingStatus),
    isSyncedToSupabase: true,
  };
}

/**
 * Fetches all bookings from Supabase and merges them with local reservations.
 */
export async function fetchBookingsFromSupabase(): Promise<Reservation[]> {
  const response = await getSupabaseBookings();
  if (response.success && response.data) {
    const supabaseReservations = response.data.map(mapSupabaseToReservation);
    const local = getBookings();

    // Merge without duplicates (Supabase records take precedence)
    const existingIds = new Set(supabaseReservations.map((r) => r.id));
    const merged = [...supabaseReservations, ...local.filter((r) => !existingIds.has(r.id))];

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch (e) {
        console.error("Failed to cache merged bookings:", e);
      }
    }
    return merged;
  }
  return getBookings();
}

/**
 * Asynchronous booking creation that sends the enquiry directly to Supabase
 * and saves a copy locally for instant offline UI responsiveness.
 */
export async function saveBookingAsync(
  data: Omit<Reservation, "id" | "createdAt" | "status">,
): Promise<{ reservation: Reservation; success: boolean; error?: string }> {
  // 1. Submit to Supabase
  const apiRes = await createSupabaseBooking({
    tripType: data.tripType,
    vehicleCategory: data.category as any,
    preferredVehicle: data.vehicle,
    passengers: data.passengers,
    pickupLocation: data.from,
    destination: data.to,
    departureDate: data.date,
    returnDate: data.returnDate,
    numberOfDays: data.days,
    waitingDays: data.waitingDays,
    customerName: data.name,
    phoneNumber: data.phone,
    emailAddress: data.email,
    specialRequirements: data.notes,
  });

  const current = getBookings();
  const assignedId =
    apiRes.success && apiRes.data?.id ? apiRes.data.id : `NR-${1049 + current.length}`;
  const newBooking: Reservation = {
    ...data,
    id: assignedId,
    createdAt: apiRes.data?.createdAt || new Date().toISOString(),
    status: "New",
    isSyncedToSupabase: apiRes.success && !apiRes.isFallback,
  };

  // Dispatch Resend emails to both admin (rasheholiday@gmail.com) and the customer (sender)
  if (!apiRes.success || apiRes.isFallback) {
    dispatchBookingEmails({
      id: assignedId,
      customer_name: data.name,
      phone_number: data.phone,
      email_address: data.email,
      trip_type: data.tripType,
      vehicle_category: data.category,
      preferred_vehicle: data.vehicle,
      passengers: data.passengers,
      pickup_location: data.from,
      destination: data.to,
      departure_date: data.date,
      return_date: data.returnDate,
      number_of_days: data.days,
      waiting_days: data.waitingDays,
      special_requirements: data.notes,
      created_at: newBooking.createdAt,
    }).catch((err) => console.warn("[saveBookingAsync] Email dispatch error:", err));
  }

  const updated = [newBooking, ...current.filter((b) => b.id !== assignedId)];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("nilgiri_booking_created"));
    } catch (err) {
      console.error("Failed to save booking:", err);
    }
  }

  return {
    reservation: newBooking,
    success: apiRes.success,
    error: apiRes.error,
  };
}

export function saveBooking(data: Omit<Reservation, "id" | "createdAt" | "status">): Reservation {
  const current = getBookings();
  const nextNumber = 1049 + current.length;
  const newBooking: Reservation = {
    ...data,
    id: `NR-${nextNumber}`,
    createdAt: new Date().toISOString(),
    status: "New",
    isSyncedToSupabase: false,
  };

  const updated = [newBooking, ...current];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("nilgiri_booking_created"));
    } catch (err) {
      console.error("Failed to save booking:", err);
    }
  }

  // Trigger background sync to Supabase if possible
  createSupabaseBooking({
    tripType: data.tripType,
    vehicleCategory: (data.category as "4-seater" | "8-seater" | "19-seater") || "8-seater",
    preferredVehicle: data.vehicle,
    passengers: data.passengers,
    pickupLocation: data.from,
    destination: data.to,
    departureDate: data.date,
    returnDate: data.returnDate,
    numberOfDays: data.days,
    customerName: data.name,
    phoneNumber: data.phone,
    emailAddress: data.email,
    specialRequirements: data.notes,
  }).catch((err) => console.warn("Background Supabase save attempt:", err));

  return newBooking;
}

export function updateBookingStatus(id: string, status: BookingStatus): Reservation[] {
  const current = getBookings();
  const updated = current.map((b) => (b.id === id ? { ...b, status } : b));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("nilgiri_bookings_updated"));
  }

  // If this booking has a UUID, sync status to Supabase
  if (id.length > 20) {
    updateSupabaseBookingStatus(id, mapUiStatusToSupabase(status)).catch((err) =>
      console.warn("Background Supabase status update error:", err),
    );
  }

  return updated;
}

export function updateBooking(id: string, updates: Partial<Reservation>): Reservation[] {
  const current = getBookings();
  const updated = current.map((b) => (b.id === id ? { ...b, ...updates } : b));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("nilgiri_bookings_updated"));
  }
  return updated;
}

export function deleteBooking(id: string): Reservation[] {
  const current = getBookings();
  const updated = current.filter((b) => b.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("nilgiri_bookings_updated"));
  }

  if (id.length > 20) {
    deleteSupabaseBooking(id).catch((err) =>
      console.warn("Background Supabase delete error:", err),
    );
  }

  return updated;
}

export function resetToDemoBookings(): Reservation[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("nilgiri_bookings_updated"));
  }
  return [];
}

export function exportBookingsCsv(bookings: Reservation[]): void {
  if (typeof window === "undefined" || bookings.length === 0) return;

  const headers = [
    "Booking ID",
    "Created Date",
    "Customer Name",
    "Phone",
    "Email",
    "Trip Type",
    "Category",
    "Vehicle",
    "Pickup (From)",
    "Destination (To)",
    "Travel Date",
    "Return Date",
    "Total Days",
    "Waiting Days",
    "Passengers",
    "Est Low (INR)",
    "Est High (INR)",
    "Status",
    "Customer Notes",
    "Internal Remarks",
  ];

  const rows = bookings.map((b) => [
    b.id,
    new Date(b.createdAt).toLocaleString("en-IN"),
    `"${(b.name || "").replace(/"/g, '""')}"`,
    `"${(b.phone || "").replace(/"/g, '""')}"`,
    `"${(b.email || "").replace(/"/g, '""')}"`,
    b.tripType,
    b.category,
    `"${(b.vehicle || "").replace(/"/g, '""')}"`,
    `"${(b.from || "").replace(/"/g, '""')}"`,
    `"${(b.to || "").replace(/"/g, '""')}"`,
    b.date || "",
    b.returnDate || "",
    b.days || 1,
    b.waitingDays || 0,
    b.passengers,
    b.estimate?.low || "",
    b.estimate?.high || "",
    b.status,
    `"${(b.notes || "").replace(/"/g, '""')}"`,
    `"${(b.internalNotes || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `nilgiri_rides_reservations_${new Date().toISOString().slice(0, 10)}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
