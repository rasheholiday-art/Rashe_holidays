import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type {
  ApiResponse,
  Booking,
  BookingFilterOptions,
  BookingRow,
  BookingStatus,
  BookingValidationResult,
  CreateBookingInput,
  EmailLog,
  EmailLogRow,
  EmailStatus,
  EmailType,
  UpdateBookingInput,
} from "@/types/booking";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const LOCAL_STORAGE_KEY = "rashe_holidays_supabase_offline_bookings";

/**
 * Formats a phone input string to always ensure it starts with "+91 "
 * and restricts the mobile number to exactly 10 numeric digits.
 */
export function formatIndianPhoneNumber(value: string): string {
  if (!value) return "";

  // Extract all digits
  let digits = value.replace(/\D/g, "");

  // If user pasted or typed with leading 91, strip it to isolate the 10 mobile digits
  if (digits.startsWith("91") && digits.length > 10) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0") && digits.length > 10) {
    digits = digits.slice(1);
  }

  // Strictly enforce max 10 digits
  digits = digits.slice(0, 10);

  if (digits.length === 0) {
    return value.startsWith("+91") ? "+91 " : "";
  }
  if (digits.length <= 5) {
    return `+91 ${digits}`;
  }
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/**
 * Validates booking submission inputs based on business and system requirements.
 * - Customer Name: Required, min 2 characters
 * - Phone Number: Required, must start with +91 and contain exactly 10 digits
 * - Departure Date: Required, valid date
 * - Email Address: Optional, but if provided must match valid format
 */
export function validateBookingInput(input: Partial<CreateBookingInput>): BookingValidationResult {
  const errors: Record<string, string> = {};

  // 1. Customer Name validation
  if (!input.customerName || input.customerName.trim().length < 2) {
    errors.customerName = "Customer name is required (minimum 2 characters).";
  }

  // 2. Phone Number validation: Must start with +91 and contain exactly 10 digits
  if (!input.phoneNumber || input.phoneNumber.trim().length === 0) {
    errors.phoneNumber = "Phone number is required.";
  } else {
    const raw = input.phoneNumber.trim();
    if (!raw.startsWith("+91")) {
      errors.phoneNumber = "Phone number must start with country code +91.";
    } else {
      const digitsAfter91 = raw.replace(/^\+91/, "").replace(/\D/g, "");
      if (digitsAfter91.length !== 10) {
        errors.phoneNumber = "Phone number must contain exactly 10 digits after +91.";
      }
    }
  }

  // 3. Departure Date validation
  if (!input.departureDate || input.departureDate.trim().length === 0) {
    errors.departureDate = "Departure date is required.";
  } else {
    const parsedDate = new Date(input.departureDate);
    if (isNaN(parsedDate.getTime())) {
      errors.departureDate = "Please select a valid departure date.";
    } else {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      if (input.departureDate < todayStr) {
        errors.departureDate =
          "Departure date cannot be in the past. Please select today or a future date.";
      }
    }
  }

  // 4. Return Date validation for round trips
  if (input.tripType === "round-trip" && input.returnDate) {
    const dep = new Date(input.departureDate || "");
    const ret = new Date(input.returnDate);
    if (!isNaN(dep.getTime()) && !isNaN(ret.getTime()) && ret < dep) {
      errors.returnDate = "Return date cannot be earlier than departure date.";
    }
  }

  // 5. Email format validation (optional field, but strictly formatted if given)
  if (input.emailAddress && input.emailAddress.trim().length > 0) {
    if (!EMAIL_REGEX.test(input.emailAddress.trim())) {
      errors.emailAddress = "Please enter a valid email address (e.g. name@example.com).";
    }
  }

  // 6. Passengers validation
  if (input.passengers !== undefined && (input.passengers < 1 || input.passengers > 30)) {
    errors.passengers = "Passenger count must be between 1 and 30.";
  }

  // 7. Route location validation
  if (!input.pickupLocation || input.pickupLocation.trim().length === 0) {
    errors.pickupLocation = "Pickup location is required.";
  }
  if (!input.destination || input.destination.trim().length === 0) {
    errors.destination = "Destination is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Maps a snake_case Supabase database row to a camelCase application Booking object
 */
export function mapRowToBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    tripType: row.trip_type,
    vehicleCategory: row.vehicle_category,
    preferredVehicle: row.preferred_vehicle,
    passengers: row.passengers,
    pickupLocation: row.pickup_location,
    destination: row.destination,
    departureDate: row.departure_date,
    returnDate: row.return_date,
    numberOfDays: row.number_of_days,
    customerName: row.customer_name,
    phoneNumber: row.phone_number,
    emailAddress: row.email_address,
    specialRequirements: row.special_requirements,
    bookingStatus: row.booking_status,
  };
}

/**
 * Maps a snake_case Supabase email_logs database row to a camelCase application EmailLog object
 */
export function mapRowToEmailLog(row: EmailLogRow): EmailLog {
  return {
    id: row.id,
    bookingId: row.booking_id,
    emailType: row.email_type as EmailType,
    recipient: row.recipient,
    status: row.status as EmailStatus,
    errorMessage: row.error_message,
    sentAt: row.sent_at,
    createdAt: row.created_at,
  };
}

/**
 * Creates a new booking in Supabase.
 * Validates all inputs before hitting the network.
 * Falls back to local storage if Supabase environment variables are pending.
 */
export async function createBooking(input: CreateBookingInput): Promise<ApiResponse<Booking>> {
  // 1. Client-side validation
  const validation = validateBookingInput(input);
  if (!validation.isValid) {
    const firstErrorMessage = Object.values(validation.errors)[0] || "Invalid booking data.";
    return {
      success: false,
      error: firstErrorMessage,
      validationErrors: validation.errors,
    };
  }

  const payload = {
    trip_type: input.tripType,
    vehicle_category: input.vehicleCategory,
    preferred_vehicle: input.preferredVehicle?.trim() || null,
    passengers: Number(input.passengers),
    pickup_location: input.pickupLocation.trim(),
    destination: input.destination.trim(),
    departure_date: input.departureDate,
    return_date: input.returnDate?.trim() || null,
    number_of_days: Math.max(1, Number(input.numberOfDays || 1)),
    customer_name: input.customerName.trim(),
    phone_number: input.phoneNumber.trim(),
    email_address: input.emailAddress?.trim() || null,
    special_requirements: input.specialRequirements?.trim() || null,
    booking_status: "pending" as const,
  };

  // 2. Fallback mode if Supabase keys not yet configured
  if (!isSupabaseConfigured) {
    const offlineBooking: Booking = {
      id: `NR-LOCAL-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tripType: input.tripType,
      vehicleCategory: input.vehicleCategory,
      preferredVehicle: input.preferredVehicle ?? null,
      passengers: input.passengers,
      pickupLocation: input.pickupLocation,
      destination: input.destination,
      departureDate: input.departureDate,
      returnDate: input.returnDate ?? null,
      numberOfDays: input.numberOfDays ?? 1,
      customerName: input.customerName,
      phoneNumber: input.phoneNumber,
      emailAddress: input.emailAddress ?? null,
      specialRequirements: input.specialRequirements ?? null,
      bookingStatus: "pending",
    };

    saveToOfflineStorage(offlineBooking);

    return {
      success: true,
      data: offlineBooking,
      isFallback: true,
    };
  }

  // 3. Dispatch via create-booking Edge Function (handles saving + Resend email dispatch)
  try {
    const { data: fnData, error: fnError } = await supabase.functions.invoke("create-booking", {
      body: payload,
    });

    if (!fnError && fnData && fnData.success && fnData.data) {
      return {
        success: true,
        data: mapRowToBooking(fnData.data as BookingRow),
      };
    }
  } catch (fnErr) {
    console.warn(
      "[createBooking] Edge function invocation skipped/failed, falling back to direct table insert:",
      fnErr,
    );
  }

  // Fallback: direct Supabase live table insert
  try {
    const { data, error } = await supabase.from("bookings").insert([payload]).select().single();

    if (error) {
      console.error("[Supabase API] Failed to create booking:", error);
      return {
        success: false,
        error: error.message || "Failed to create booking in database.",
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Booking record was not returned by server.",
      };
    }

    return {
      success: true,
      data: mapRowToBooking(data as BookingRow),
    };
  } catch (err: unknown) {
    console.error("[Supabase API] Network exception during createBooking:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unexpected connection error.",
    };
  }
}

/**
 * Retrieves a single booking by ID (Admin or secure lookup)
 */
export async function getBooking(
  id: string,
  customerPhone?: string,
): Promise<ApiResponse<Booking>> {
  if (!id || id.trim().length === 0) {
    return { success: false, error: "Booking ID is required." };
  }

  // Fallback offline search
  if (!isSupabaseConfigured) {
    const offlineList = getOfflineStorage();
    const found = offlineList.find((b) => b.id === id);
    if (found) {
      return { success: true, data: found, isFallback: true };
    }
    return { success: false, error: "Booking not found." };
  }

  try {
    // Direct query (Admins / Authenticated sessions)
    const { data, error } = await supabase.from("bookings").select("*").eq("id", id).maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: "Booking not found." };
    }

    return { success: true, data: mapRowToBooking(data as BookingRow) };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to retrieve booking.",
    };
  }
}

/**
 * Retrieves all bookings (Admin only)
 * Supports status filtering, search term query, and pagination
 */
export async function getAllBookings(
  options: BookingFilterOptions = {},
): Promise<ApiResponse<Booking[]>> {
  const { status = "all", searchQuery = "", limit = 100, offset = 0 } = options;

  if (!isSupabaseConfigured) {
    let list = getOfflineStorage();
    if (status !== "all") {
      list = list.filter((b) => b.bookingStatus === status);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.customerName.toLowerCase().includes(q) ||
          b.phoneNumber.includes(q) ||
          b.pickupLocation.toLowerCase().includes(q) ||
          b.destination.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q),
      );
    }
    return { success: true, data: list, isFallback: true };
  }

  try {
    let query = supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status !== "all") {
      query = query.eq("booking_status", status);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      query = query.or(
        `customer_name.ilike.%${q}%,phone_number.ilike.%${q}%,pickup_location.ilike.%${q}%,destination.ilike.%${q}%`,
      );
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    const bookings = ((data as BookingRow[]) || []).map(mapRowToBooking);
    return { success: true, data: bookings };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load bookings from Supabase.",
    };
  }
}

/**
 * Admin action: Update booking status
 */
export async function updateBookingStatus(
  id: string,
  newStatus: BookingStatus,
): Promise<ApiResponse<Booking>> {
  if (!isSupabaseConfigured) {
    const list = getOfflineStorage();
    const updated = list.map((b) => (b.id === id ? { ...b, bookingStatus: newStatus } : b));
    saveAllToOfflineStorage(updated);
    const target = updated.find((b) => b.id === id);
    return target
      ? { success: true, data: target, isFallback: true }
      : { success: false, error: "Booking not found." };
  }

  try {
    const { data, error } = await supabase
      .from("bookings")
      .update({ booking_status: newStatus })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: mapRowToBooking(data as BookingRow) };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update booking status.",
    };
  }
}

/**
 * Admin action: Delete a booking
 */
export async function deleteBooking(id: string): Promise<ApiResponse<boolean>> {
  if (!isSupabaseConfigured) {
    const list = getOfflineStorage();
    const remaining = list.filter((b) => b.id !== id);
    saveAllToOfflineStorage(remaining);
    return { success: true, data: true, isFallback: true };
  }

  try {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete booking.",
    };
  }
}

/**
 * Fetches all email dispatch logs for a specific booking from public.email_logs
 */
export async function getEmailLogs(bookingId: string): Promise<ApiResponse<EmailLog[]>> {
  if (!isSupabaseConfigured) {
    return { success: true, data: [] };
  }

  try {
    const { data, error } = await supabase
      .from("email_logs")
      .select("*")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[getEmailLogs] Could not fetch email logs:", error.message);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: ((data as EmailLogRow[]) || []).map(mapRowToEmailLog),
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load email logs",
    };
  }
}

/**
 * Triggers a resend of customer confirmation, admin alert, or both via the resend-booking-email Edge Function
 */
export async function resendBookingEmail(
  bookingId: string,
  emailType: "customer_confirmation" | "admin_notification" | "both" = "both",
): Promise<ApiResponse<unknown>> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: "Supabase connection is not configured in local environment.",
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke("resend-booking-email", {
      body: { booking_id: bookingId, email_type: emailType },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to trigger email resend.",
    };
  }
}

// ---------------------------------------------------------------------------
// Offline / Fallback Local Storage Helpers
// ---------------------------------------------------------------------------

function getOfflineStorage(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToOfflineStorage(booking: Booking): void {
  if (typeof window === "undefined") return;
  try {
    const current = getOfflineStorage();
    const updated = [booking, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("nilgiri_booking_created"));
  } catch (e) {
    console.warn("Could not save to offline storage:", e);
  }
}

function saveAllToOfflineStorage(list: Booking[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("nilgiri_bookings_updated"));
  } catch (e) {
    console.warn("Could not save to offline storage:", e);
  }
}
