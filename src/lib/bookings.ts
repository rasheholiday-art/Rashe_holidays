import {
  createBooking as createSupabaseBooking,
  getAllBookings as getSupabaseBookings,
  updateBookingStatus as updateSupabaseBookingStatus,
  deleteBooking as deleteSupabaseBooking,
  getBooking as getSupabaseBooking,
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
      }
    | null
    | undefined;
  status: BookingStatus;
  internalNotes?: string | undefined;
  isSyncedToSupabase?: boolean;
}

const STORAGE_KEY = "nilgiri_rides_reservations";

const SEED_RESERVATIONS: Reservation[] = [
  {
    id: "NR-1048",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
    tripType: "round-trip",
    category: "8-seater",
    vehicle: "toyota-innova-hycross",
    from: "Ooty",
    to: "Mysore",
    date: "2026-09-20",
    returnDate: "2026-09-22",
    passengers: 6,
    days: 3,
    name: "Arunachalam K",
    phone: "+91 94432 18940",
    email: "arun.k@example.com",
    notes:
      "Visiting Mysore Palace and Chamundi Hills. Senior citizens travelling, need gentle driving.",
    estimate: { low: 11500, high: 13500, km: 380, days: 3 },
    status: "New",
  },
  {
    id: "NR-1047",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    tripType: "one-way",
    category: "19-seater",
    vehicle: "",
    from: "Coimbatore Airport",
    to: "Ooty",
    date: "2026-09-24",
    passengers: 14,
    days: 1,
    name: "Pooja Venkatesh",
    phone: "+91 98840 55120",
    email: "pooja.v@techcorp.in",
    notes: "Corporate leadership retreat offsite. Lots of luggage bags.",
    estimate: { low: 7800, high: 9000, km: 95, days: 1 },
    status: "Contacted",
    internalNotes: "Sent quotation on WhatsApp, awaiting flight timing confirmation.",
  },
  {
    id: "NR-1046",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    tripType: "round-trip",
    category: "4-seater",
    vehicle: "maruti-suzuki-swift-dzire",
    from: "Ooty",
    to: "Coonoor",
    date: "2026-09-18",
    returnDate: "2026-09-18",
    passengers: 2,
    days: 1,
    name: "Rohan & Meera",
    phone: "+91 97910 88231",
    email: "rohan.m@gmail.com",
    notes: "Honeymoon couple, Sim's Park, Tea Factory and Dolphin's Nose viewpoint.",
    estimate: { low: 2200, high: 2800, km: 60, days: 1 },
    status: "Confirmed",
    internalNotes: "Assigned driver Ramesh (Swift Dzire TN 43 D 8291). Advance received.",
  },
  {
    id: "NR-1045",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    tripType: "one-way",
    category: "8-seater",
    vehicle: "toyota-innova-crysta",
    from: "Ooty",
    to: "Bangalore",
    date: "2026-09-28",
    passengers: 5,
    days: 1,
    name: "Dr. Siddharth Rao",
    phone: "+91 98450 11923",
    email: "dr.siddharth@apollo.org",
    notes: "Drop to Indiranagar, Bangalore via Gundlupet and Mysore highway.",
    estimate: { low: 8800, high: 10200, km: 290, days: 1 },
    status: "Confirmed",
  },
  {
    id: "NR-1044",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    tripType: "round-trip",
    category: "4-seater",
    vehicle: "hyundai-aura",
    from: "Ooty",
    to: "Wayanad",
    date: "2026-09-15",
    returnDate: "2026-09-17",
    passengers: 3,
    days: 2,
    name: "Kavita Nair",
    phone: "+91 94470 33819",
    notes: "Route changed by customer to Coorg instead.",
    estimate: { low: 6400, high: 7500, km: 240, days: 2 },
    status: "Cancelled",
  },
];

export function getBookings(): Reservation[] {
  if (typeof window === "undefined") return SEED_RESERVATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_RESERVATIONS));
      return SEED_RESERVATIONS;
    }
    return JSON.parse(raw) as Reservation[];
  } catch (err) {
    console.error("Failed to parse stored bookings:", err);
    return SEED_RESERVATIONS;
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
        window.dispatchEvent(new Event("nilgiri_bookings_updated"));
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_RESERVATIONS));
    window.dispatchEvent(new Event("nilgiri_bookings_updated"));
  }
  return SEED_RESERVATIONS;
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
