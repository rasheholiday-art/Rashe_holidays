import { z } from "zod";

export const bookingSearchSchema = z.object({
  tripType: z.enum(["one-way", "round-trip"]).optional(),
  category: z.enum(["4-seater", "7-seater", "9-seater", "12-seater", "16-seater"]).optional(),
  vehicle: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  date: z.string().optional(),
  returnDate: z.string().optional(),
  passengers: z.coerce.number().int().min(1).max(20).optional(),
  waitingDays: z.coerce.number().int().min(0).max(30).optional(),
  fixedPrice: z.coerce.number().optional(),
  destinationSlug: z.string().optional(),
});

export type BookingSearch = z.infer<typeof bookingSearchSchema>;

export const vehiclesSearchSchema = z.object({
  category: z.enum(["4-seater", "7-seater", "9-seater", "12-seater", "16-seater"]).optional(),
});
