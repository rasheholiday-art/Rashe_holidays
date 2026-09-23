import { Link } from "@tanstack/react-router";
import { CheckCircle2, Info, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  categories,
  estimateDistance,
  estimateFare,
  inr,
  locations,
  vehicles,
  vehiclesByCategory,
  type CategoryId,
} from "@/data/site";
import type { BookingSearch } from "@/lib/booking-search";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/data/site";
import { WhatsAppIcon } from "./WhatsAppButton";
import { saveBookingAsync } from "@/lib/bookings";
import { validateBookingInput, formatIndianPhoneNumber } from "@/lib/api/bookings";
import { calculateRouteDistance, type RouteCalculationResult } from "@/lib/route-calculator";

const inputCls =
  "h-12 w-full rounded-xl border border-input bg-card px-4 text-sm font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground placeholder:font-normal focus:border-gold focus:ring-2 focus:ring-gold/30";

type TripType = "one-way" | "round-trip";

export function BookingForm({ initial }: { initial: BookingSearch }) {
  // Today's date in local YYYY-MM-DD
  const todayStr = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, []);

  const [tripType, setTripType] = useState<TripType>(initial.tripType ?? "round-trip");
  const [category, setCategory] = useState<CategoryId>(initial.category ?? "8-seater");
  const [vehicle, setVehicle] = useState(initial.vehicle ?? "");
  const [from, setFrom] = useState(initial.from ?? "Ooty");
  const [to, setTo] = useState(initial.to ?? "Mysore");
  const [date, setDate] = useState(() => {
    if (initial.date && initial.date >= todayStr) return initial.date;
    return "";
  });
  const [returnDate, setReturnDate] = useState(() => {
    if (initial.returnDate && initial.returnDate >= todayStr) return initial.returnDate;
    return "";
  });
  const [passengers, setPassengers] = useState(initial.passengers ?? 4);
  const [days, setDays] = useState(() => daysBetween(initial.date, initial.returnDate) ?? 1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Dynamic route calculation state
  const [routeInfo, setRouteInfo] = useState<RouteCalculationResult | null>(() => {
    const initFrom = initial.from ?? "Ooty";
    const initTo = initial.to ?? "Mysore";
    const sync = estimateDistance(initFrom, initTo);
    return sync !== null ? { km: sync, source: "local", fromName: initFrom, toName: initTo } : null;
  });
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const cleanFrom = from.trim();
    const cleanTo = to.trim();

    if (!cleanFrom || !cleanTo) {
      setRouteInfo(null);
      setIsCalculatingRoute(false);
      return;
    }

    // 1. Try local verified distance immediately
    const syncDist = estimateDistance(cleanFrom, cleanTo);
    if (syncDist !== null) {
      setRouteInfo({ km: syncDist, source: "local", fromName: cleanFrom, toName: cleanTo });
      setIsCalculatingRoute(false);
      return;
    }

    // 2. Debounced OSRM calculation for typed/custom places
    setIsCalculatingRoute(true);
    const timer = setTimeout(async () => {
      try {
        const result = await calculateRouteDistance(cleanFrom, cleanTo);
        if (!isCancelled) {
          setRouteInfo(result);
          setIsCalculatingRoute(false);
        }
      } catch {
        if (!isCancelled) {
          setIsCalculatingRoute(false);
        }
      }
    }, 450);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [from, to]);

  const cat = categories.find((c) => c.id === category)!;
  const options = vehiclesByCategory(category);
  const estimate = useMemo(
    () => estimateFare({ category, tripType, from, to, days, customKm: routeInfo?.km }),
    [category, tripType, from, to, days, routeInfo?.km],
  );
  const seatWarning = passengers > cat.seats;

  if (submitted) {
    const summary = `Booking request: ${tripType === "one-way" ? "One Way" : "Round Trip"}, ${cat.label}${vehicle ? ` (${vehicles.find((v) => v.slug === vehicle)?.name})` : ""}, ${from} → ${to}, ${date || "date TBD"}${tripType === "round-trip" && returnDate ? ` to ${returnDate}` : ""}, ${passengers} pax. Name: ${name}, Phone: ${phone}.`;
    return (
      <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-card sm:p-12 animate-fade-up">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="size-8" />
        </span>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight">
          Thank you, {name.split(" ")[0]}!
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Your travel request has been received. Our team will contact you shortly to confirm
          availability and pricing.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl bg-secondary p-5 text-left text-sm">
          <Row k="Trip" v={`${tripType === "one-way" ? "One Way" : "Round Trip"} · ${cat.label}`} />
          <Row k="Route" v={`${from} → ${to}${tripType === "round-trip" ? ` → ${from}` : ""}`} />
          <Row
            k="Dates"
            v={`${date || "To be confirmed"}${tripType === "round-trip" && returnDate ? ` – ${returnDate}` : ""}`}
          />
          <Row k="Passengers" v={`${passengers}`} />
          {estimate && <Row k="Estimate" v={`${inr(estimate.low)} – ${inr(estimate.high)}`} />}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="gold" size="lg">
            <a href={whatsappUrl(summary)} target="_blank" rel="noreferrer">
              <WhatsAppIcon className="size-5" /> Send details on WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitError(null);

        // Client-side validation using shared rules
        const validation = validateBookingInput({
          customerName: name,
          phoneNumber: phone,
          departureDate: date,
          returnDate: tripType === "round-trip" ? returnDate : undefined,
          emailAddress: email || undefined,
          passengers,
          tripType,
          pickupLocation: from,
          destination: to,
        });

        if (!validation.isValid) {
          setFieldErrors(validation.errors);
          const firstErr = Object.values(validation.errors)[0];
          setSubmitError(firstErr);
          return;
        }

        setFieldErrors({});
        setIsSubmitting(true);

        try {
          const res = await saveBookingAsync({
            tripType,
            category,
            vehicle: vehicle || undefined,
            from,
            to,
            date,
            returnDate: tripType === "round-trip" ? returnDate : undefined,
            passengers,
            days,
            name,
            phone,
            email: email || undefined,
            notes: notes || undefined,
            estimate,
          });

          setSubmitted(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err: unknown) {
          const msg =
            err instanceof Error ? err.message : "Failed to record booking. Please try again.";
          setSubmitError(msg);
        } finally {
          setIsSubmitting(false);
        }
      }}
      className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start"
    >
      <div className="space-y-8">
        {submitError && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive">
            {submitError}
          </div>
        )}

        <Section n="1" title="Trip details">
          <div className="grid gap-4 sm:grid-cols-2">
            <L label="Trip Type">
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value as TripType)}
                className={inputCls}
              >
                <option value="one-way">One Way</option>
                <option value="round-trip">Round Trip</option>
              </select>
            </L>
            <L label="Vehicle Category">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as CategoryId);
                  setVehicle("");
                }}
                className={inputCls}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </L>
            <L label="Preferred Vehicle" hint="Optional">
              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className={inputCls}
              >
                <option value="">Any available {cat.seats}-seater</option>
                {options.map((v) => (
                  <option key={v.slug} value={v.slug}>
                    {v.name}
                    {v.available ? "" : " (on request)"}
                  </option>
                ))}
              </select>
            </L>
            <L label="Number of Passengers">
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className={cn(
                  inputCls,
                  (seatWarning || fieldErrors.passengers) && "border-destructive",
                )}
              >
                {Array.from({ length: 19 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              {seatWarning && (
                <p className="mt-1.5 text-xs text-destructive">
                  This category seats {cat.seats}. Choose a larger vehicle or we'll arrange two.
                </p>
              )}
              {fieldErrors.passengers && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.passengers}</p>
              )}
            </L>
          </div>
        </Section>

        <Section n="2" title="Route & dates">
          <div className="grid gap-4 sm:grid-cols-2">
            <L label="Pickup Location">
              <input
                list="locs"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  if (fieldErrors.pickupLocation)
                    setFieldErrors((f) => ({ ...f, pickupLocation: "" }));
                }}
                className={cn(inputCls, fieldErrors.pickupLocation && "border-destructive")}
                placeholder="e.g. Ooty"
                required
              />
              {fieldErrors.pickupLocation && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.pickupLocation}</p>
              )}
            </L>
            <L label="Destination">
              <input
                list="locs"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  if (fieldErrors.destination) setFieldErrors((f) => ({ ...f, destination: "" }));
                }}
                className={cn(inputCls, fieldErrors.destination && "border-destructive")}
                placeholder="e.g. Mysore"
                required
              />
              {fieldErrors.destination && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.destination}</p>
              )}
            </L>
            <datalist id="locs">
              {locations.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
            <L label="Departure Date">
              <input
                type="date"
                min={todayStr}
                value={date}
                onChange={(e) => {
                  const nextDate = e.target.value;
                  setDate(nextDate);
                  if (fieldErrors.departureDate)
                    setFieldErrors((f) => ({ ...f, departureDate: "" }));
                  if (returnDate && returnDate < nextDate) {
                    setReturnDate(nextDate);
                    setDays(1);
                  } else {
                    const d = daysBetween(nextDate, returnDate);
                    if (d) setDays(d);
                  }
                }}
                className={cn(inputCls, fieldErrors.departureDate && "border-destructive")}
                required
              />
              {fieldErrors.departureDate && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.departureDate}</p>
              )}
            </L>
            {tripType === "round-trip" && (
              <L label="Return Date">
                <input
                  type="date"
                  value={returnDate}
                  min={date && date >= todayStr ? date : todayStr}
                  onChange={(e) => {
                    setReturnDate(e.target.value);
                    if (fieldErrors.returnDate) setFieldErrors((f) => ({ ...f, returnDate: "" }));
                    const d = daysBetween(date, e.target.value);
                    if (d) setDays(d);
                  }}
                  className={cn(inputCls, fieldErrors.returnDate && "border-destructive")}
                />
                {fieldErrors.returnDate && (
                  <p className="mt-1 text-xs text-destructive">{fieldErrors.returnDate}</p>
                )}
              </L>
            )}
            {tripType === "round-trip" && (
              <L label="Number of Days">
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={days}
                  onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
                  className={inputCls}
                />
              </L>
            )}
          </div>
        </Section>

        <Section n="3" title="Your details">
          <div className="grid gap-4 sm:grid-cols-2">
            <L label="Customer Name">
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.customerName) setFieldErrors((f) => ({ ...f, customerName: "" }));
                }}
                className={cn(inputCls, fieldErrors.customerName && "border-destructive")}
                placeholder="Full name (e.g. Anand Kumar)"
                required
                autoComplete="name"
              />
              {fieldErrors.customerName && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.customerName}</p>
              )}
            </L>
            <L label="Phone Number" hint="+91 · 10 digits">
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => {
                  const formatted = formatIndianPhoneNumber(e.target.value);
                  setPhone(formatted);
                  if (fieldErrors.phoneNumber) setFieldErrors((f) => ({ ...f, phoneNumber: "" }));
                }}
                onFocus={() => {
                  if (!phone) {
                    setPhone("+91 ");
                  }
                }}
                className={cn(inputCls, fieldErrors.phoneNumber && "border-destructive")}
                placeholder="+91 98765 43210"
                maxLength={16}
                required
                autoComplete="tel"
              />
              {fieldErrors.phoneNumber && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.phoneNumber}</p>
              )}
            </L>

            <L label="Email Address" className="sm:col-span-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.emailAddress) setFieldErrors((f) => ({ ...f, emailAddress: "" }));
                }}
                className={cn(inputCls, fieldErrors.emailAddress && "border-destructive")}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {fieldErrors.emailAddress && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.emailAddress}</p>
              )}
            </L>
            <L label="Special Requirements" hint="Optional" className="sm:col-span-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className={cn(inputCls, "h-auto py-3")}
                placeholder="Extra luggage, child seat, multiple destinations, hotel pickup, sightseeing requirements…"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  "Extra luggage",
                  "Child seat",
                  "Multiple destinations",
                  "Hotel pickup",
                  "Sightseeing",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNotes((n) => (n ? `${n}, ${s}` : s))}
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-gold hover:text-foreground"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </L>
          </div>
        </Section>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-24 rounded-[2rem] border border-border bg-card p-6 shadow-card">
        <p className="eyebrow">Estimate</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">{cat.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {from || "—"} → {to || "—"}
          {tripType === "round-trip" ? ` → ${from || "—"}` : ""}
        </p>
        <div className="mt-5 rounded-2xl bg-ink p-5 text-ink-foreground">
          {isCalculatingRoute ? (
            <div className="py-4 text-center">
              <RefreshCw className="mx-auto size-5 animate-spin text-gold" />
              <p className="mt-2 text-xs font-semibold text-ink-muted">
                Calculating live road distance…
              </p>
            </div>
          ) : estimate ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  Estimated fare
                </p>
                {routeInfo?.source === "osrm" && (
                  <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold">
                    Live Route
                  </span>
                )}
              </div>
              <p className="mt-1 text-3xl font-bold tracking-tight">
                {inr(estimate.low)}{" "}
                <span className="text-base font-medium text-ink-muted">– {inr(estimate.high)}</span>
              </p>
              <p className="mt-2 text-xs text-ink-muted">
                ≈ {estimate.km} km {routeInfo?.source === "osrm" ? "(via road routing)" : ""} ·{" "}
                {tripType === "one-way"
                  ? `${inr(cat.pricing.oneWayPerKm)}/km`
                  : `${inr(cat.pricing.roundTripPerKm)}/km · ${estimate.days} day${estimate.days > 1 ? "s" : ""}`}
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                Estimated fare
              </p>
              <p className="mt-1 text-lg font-semibold">Custom route</p>
              <p className="mt-2 text-xs text-ink-muted">
                We'll send an exact quote for this route. Rates from {inr(cat.pricing.oneWayPerKm)}
                /km.
              </p>
            </>
          )}
        </div>
        <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
          <li className="flex gap-2">
            <Sparkles className="size-3.5 shrink-0 text-gold" />
            Driver allowance included in estimate
          </li>
          <li className="flex gap-2">
            <Info className="size-3.5 shrink-0 text-gold" />
            Toll, parking & permits at actuals
          </li>
        </ul>
        <Button
          type="submit"
          variant="gold"
          size="xl"
          className="mt-6 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="size-4 animate-spin" /> Submitting Enquiry…
            </span>
          ) : (
            "Request Booking"
          )}
        </Button>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          No payment now. We confirm availability and final price first.
        </p>
      </aside>
    </form>
  );
}

function daysBetween(a?: string, b?: string) {
  if (!a || !b) return null;
  const d = Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000) + 1;
  return d > 0 ? d : null;
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-[2rem] border border-border bg-card p-6 shadow-card sm:p-8">
      <legend className="sr-only">{title}</legend>
      <div className="mb-6 flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full bg-ink text-xs font-bold text-ink-foreground">
          {n}
        </span>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      </div>
      {children}
    </fieldset>
  );
}

function L({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
        {hint && <span className="font-medium normal-case tracking-normal opacity-70">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/70 py-2 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-semibold">{v}</span>
    </div>
  );
}
