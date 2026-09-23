export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          trip_type: "one-way" | "round-trip";
          vehicle_category: "4-seater" | "8-seater" | "19-seater";
          preferred_vehicle: string | null;
          passengers: number;
          pickup_location: string;
          destination: string;
          departure_date: string;
          return_date: string | null;
          number_of_days: number;
          customer_name: string;
          phone_number: string;
          email_address: string | null;
          special_requirements: string | null;
          booking_status: "pending" | "contacted" | "confirmed" | "completed" | "cancelled";
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          trip_type: "one-way" | "round-trip";
          vehicle_category: "4-seater" | "8-seater" | "19-seater";
          preferred_vehicle?: string | null;
          passengers: number;
          pickup_location: string;
          destination: string;
          departure_date: string;
          return_date?: string | null;
          number_of_days?: number;
          customer_name: string;
          phone_number: string;
          email_address?: string | null;
          special_requirements?: string | null;
          booking_status?: "pending" | "contacted" | "confirmed" | "completed" | "cancelled";
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          trip_type?: "one-way" | "round-trip";
          vehicle_category?: "4-seater" | "8-seater" | "19-seater";
          preferred_vehicle?: string | null;
          passengers?: number;
          pickup_location?: string;
          destination?: string;
          departure_date?: string;
          return_date?: string | null;
          number_of_days?: number;
          customer_name?: string;
          phone_number?: string;
          email_address?: string | null;
          special_requirements?: string | null;
          booking_status?: "pending" | "contacted" | "confirmed" | "completed" | "cancelled";
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };

    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
