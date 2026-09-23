import type { Database } from "./database.types";

export type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
export type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];

export type TripType = "one-way" | "round-trip";
export type VehicleCategory = "4-seater" | "8-seater" | "19-seater";
export type BookingStatus = "pending" | "contacted" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  createdAt: string;
  updatedAt: string;
  tripType: TripType;
  vehicleCategory: VehicleCategory;
  preferredVehicle?: string | null;
  passengers: number;
  pickupLocation: string;
  destination: string;
  departureDate: string;
  returnDate?: string | null;
  numberOfDays: number;
  customerName: string;
  phoneNumber: string;
  emailAddress?: string | null;
  specialRequirements?: string | null;
  bookingStatus: BookingStatus;
}

export interface CreateBookingInput {
  tripType: TripType;
  vehicleCategory: VehicleCategory;
  preferredVehicle?: string | null;
  passengers: number;
  pickupLocation: string;
  destination: string;
  departureDate: string;
  returnDate?: string | null;
  numberOfDays?: number;
  customerName: string;
  phoneNumber: string;
  emailAddress?: string | null;
  specialRequirements?: string | null;
}

export interface UpdateBookingInput {
  bookingStatus?: BookingStatus;
  specialRequirements?: string | null;
  preferredVehicle?: string | null;
}

export interface BookingFilterOptions {
  status?: BookingStatus | "all";
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: Record<string, string>;
  isFallback?: boolean;
}

export interface BookingValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export type EmailType = "customer_confirmation" | "admin_notification";
export type EmailStatus = "pending" | "sent" | "failed";

export interface EmailLog {
  id: string;
  bookingId: string;
  emailType: EmailType;
  recipient: string;
  status: EmailStatus;
  errorMessage?: string | null;
  sentAt?: string | null;
  createdAt: string;
}

export interface EmailLogRow {
  id: string;
  booking_id: string;
  email_type: string;
  recipient: string;
  status: string;
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
}
