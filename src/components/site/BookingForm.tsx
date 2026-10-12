import { Link } from "@tanstack/react-router";
import { CheckCircle2, Info, RefreshCw, Sparkles, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  categories,
  destinations,
  estimateDistance,
  estimateFare,
  inr,
  locations,
  vehicles,
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

  const [from, setFrom] = useState(initial.from ?? "Ooty");
  const [to, setTo] = useState(initial.to ?? "Coonoor");

  // Specific vehicle selection - default to crysta or initial vehicle/category
  const [vehicle, setVehicle] = useState<string>(() => {
    if (initial.vehicle && vehicles.some((v) => v.slug === initial.vehicle)) {
      return initial.vehicle;
    }
    if (initial.category) {
      const match = vehicles.find((v) => v.category === initial.category);
      if (match) return match.slug;
    }
    return "crysta";
  });

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.slug === vehicle) ?? vehicles[0],
    [vehicle],
  );
  const category = selectedVehicle.category;
  const cat = categories.find((c) => c.id === category) ?? categories[0];

  // Check if route matches a fixed package destination (e.g. Ooty -> Coonoor, Pykara, Mudumalai, Coimbatore Airport)
  const matchedDestination = useMemo(() => {
    const f = from.trim().toLowerCase();
    const t = to.trim().toLowerCase();
    if (f === "ooty") {
      return destinations.find((d) => d.name.toLowerCase() === t);
    }
    if (t === "ooty") {
      return destinations.find((d) => d.name.toLowerCase() === f);
    }
    return null;
  }, [from, to]);

  const isFixedDayTrip = Boolean(matchedDestination);

  const [tripType, setTripType] = useState<TripType>(() => {
    if (initial.tripType) return initial.tripType;
    return "round-trip";
  });

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

  // Require full place names (minimum 3 characters each) before initiating any route calculations
  const hasValidRoute = from.trim().length >= 3 && to.trim().length >= 3;

  // Dynamic route calculation state
  const [routeInfo, setRouteInfo] = useState<RouteCalculationResult | null>(() => {
    const initFrom = initial.from ?? "Ooty";
    const initTo = initial.to ?? "Coonoor";
    if (initFrom.trim().length < 3 || initTo.trim().length < 3) return null;
    const sync = estimateDistance(initFrom, initTo);
    return sync !== null ? { km: sync, source: "local", fromName: initFrom, toName: initTo } : null;
  });
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const cleanFrom = from.trim();
    const cleanTo = to.trim();

    // Do NOT calculate distance or display premature rates on single-letter entries
    if (cleanFrom.length < 3 || cleanTo.length < 3) {
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

    // 2. Debounced OSRM calculation for typed/custom places (waits for full name to be typed)
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
    }, 700);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [from, to]);

  const activeFixedPrice = useMemo(() => {
    if (!matchedDestination) return null;
    if (matchedDestination.fixedPrices[selectedVehicle.slug]) {
      return matchedDestination.fixedPrices[selectedVehicle.slug];
    }
    return null;
  }, [matchedDestination, selectedVehicle]);

  const effectiveTripType: TripType = isFixedDayTrip
    ? (matchedDestination?.type === "sightseeing" ? "round-trip" : "one-way")
    : tripType;

  const effectiveDays = isFixedDayTrip ? 1 : days;

  const estimate = useMemo(() => {
    if (!hasValidRoute) return null;
    return estimateFare({
      category,
      vehicle: selectedVehicle.slug,
      tripType: effectiveTripType,
      from,
      to,
      days: effectiveDays,
      waitingDays: 0,
      customKm: routeInfo?.km,
    });
  }, [hasValidRoute, category, selectedVehicle.slug, effectiveTripType, from, to, effectiveDays, routeInfo?.km]);

  const seatWarning = passengers > selectedVehicle.seats;

  if (submitted) {
    const summary = `Booking request: ${isFixedDayTrip ? "Day Package" : effectiveTripType === "one-way" ? "One Way" : "Round Trip"}, ${selectedVehicle.name}, ${from} → ${to}, ${date || "date TBD"}${!isFixedDayTrip && effectiveTripType === "round-trip" && returnDate ? ` to ${returnDate}` : ""} (${effectiveDays} day${effectiveDays > 1 ? "s" : ""}), ${passengers} pax. Name: ${name}, Phone: ${phone}.`;
    return (
      <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-card sm:p-12 animate-fade-up">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="size-8" />
        </span>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight">
          Thank you, {name.split(" ")[0]}!
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Your travel request has been received. A confirmation email with your trip summary has been dispatched to <strong className="text-foreground">{email}</strong>. Our team will contact you shortly to confirm timings and final pricing.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl bg-secondary p-5 text-left text-sm">
          <Row k="Trip" v={isFixedDayTrip ? "Day Tour Package" : effectiveTripType === "one-way" ? "One Way" : "Round Trip"} />
          <Row k="Vehicle" v={selectedVehicle.name} />
          <Row k="Route" v={`${from} → ${to}${!isFixedDayTrip && effectiveTripType === "round-trip" ? ` → ${from}` : ""}`} />
          <Row
            k={isFixedDayTrip ? "Tour Date" : "Date"}
            v={`${date || "To be confirmed"}${!isFixedDayTrip && effectiveTripType === "round-trip" && returnDate ? ` – ${returnDate}` : ""}`}
          />
          {!isFixedDayTrip && effectiveTripType === "round-trip" && (
            <Row k="Total Duration" v={`${effectiveDays} day${effectiveDays > 1 ? "s" : ""}`} />
          )}
          <Row k="Passengers" v={`${passengers}`} />
          {email && <Row k="Confirmation Sent To" v={email} />}
          {activeFixedPrice ? (
            <Row k="Package Fare" v={`${inr(activeFixedPrice)} approx.`} />
          ) : (
            estimate && <Row k="Estimated Fare" v={`${inr(estimate.low)} – ${inr(estimate.high)} approx.`} />
          )}
          <Row k="Toll & Parking" v="At actuals (state to state)" />
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          * Fares are approximate and may be lesser depending on your exact itinerary and season.
        </p>
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

        // Client-side validation
        const validation = validateBookingInput({
          customerName: name,
          phoneNumber: phone,
          departureDate: date,
          returnDate: !isFixedDayTrip && effectiveTripType === "round-trip" ? returnDate : undefined,
          emailAddress: email || undefined,
          passengers,
          tripType: effectiveTripType,
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
          await saveBookingAsync({
            tripType: effectiveTripType,
            category,
            vehicle: selectedVehicle.slug,
            from,
            to,
            date,
            returnDate: !isFixedDayTrip && effectiveTripType === "round-trip" ? returnDate : undefined,
            passengers,
            days: effectiveDays,
            waitingDays: 0,
            name,
            phone,
            email: email || undefined,
            notes: notes || undefined,
            estimate: activeFixedPrice
              ? {
                  low: activeFixedPrice,
                  high: activeFixedPrice,
                  km: routeInfo?.km ?? 0,
                  days: 1,
                  waitingDays: 0,
                  travelDays: 1,
                  tollNote: "Tolls are not included and billed at actuals as they vary state to state",
                }
              : estimate,
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

        <Section n="1" title="Trip & vehicle details">
          <div className="grid gap-4 sm:grid-cols-2">
            <L label="Trip Type">
              <select
                value={effectiveTripType}
                onChange={(e) => {
                  const t = e.target.value as TripType;
                  setTripType(t);
                }}
                disabled={isFixedDayTrip}
                className={cn(inputCls, isFixedDayTrip && "bg-secondary text-foreground cursor-default")}
              >
                {isFixedDayTrip ? (
                  <option value={matchedDestination?.type === "sightseeing" ? "round-trip" : "one-way"}>
                    {matchedDestination?.type === "sightseeing"
                      ? "Day Sightseeing Package"
                      : "Direct Transfer Package"}
                  </option>
                ) : (
                  <>
                    <option value="round-trip">Round Trip</option>
                    <option value="one-way">One Way</option>
                  </>
                )}
              </select>
              {isFixedDayTrip && (
                <p className="mt-1 text-xs text-gold font-medium">
                  {matchedDestination?.name} is a 1-day trip package with fixed pricing.
                </p>
              )}
            </L>

            <L label="Vehicle" hint="Choose specific vehicle">
              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className={inputCls}
              >
                {vehicles.map((v) => (
                  <option key={v.slug} value={v.slug}>
                    {v.name} · {v.seats} Seats ({v.luggage} Luggage)
                  </option>
                ))}
              </select>
            </L>

            <L label="Number of Passengers" className="sm:col-span-2">
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className={cn(
                  inputCls,
                  (seatWarning || fieldErrors.passengers) && "border-destructive",
                )}
              >
                {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} passenger{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              {seatWarning && (
                <p className="mt-1.5 text-xs text-destructive">
                  {selectedVehicle.name} seats {selectedVehicle.seats} passengers. Choose a larger vehicle or we can arrange two vehicles.
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
                placeholder="e.g. Coonoor"
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

            <L
              label={isFixedDayTrip ? "Tour Date" : "Departure Date"}
              hint={isFixedDayTrip ? "Day trip" : undefined}
              className={isFixedDayTrip ? "sm:col-span-2" : undefined}
            >
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

            {/* If NOT a fixed price day trip and trip is round trip, show return date and total trip days */}
            {!isFixedDayTrip && effectiveTripType === "round-trip" && (
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

            {!isFixedDayTrip && effectiveTripType === "round-trip" && (
              <L label="Total Trip Days">
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={days}
                  onChange={(e) => {
                    const nextDays = Math.max(1, Number(e.target.value));
                    setDays(nextDays);
                  }}
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
                onBlur={() => {
                  if (phone.trim() === "+91" || phone.trim() === "+") {
                    setPhone("");
                  }
                }}
                className={cn(inputCls, fieldErrors.phoneNumber && "border-destructive")}
                placeholder="+91 97869 63659"
                maxLength={16}
                required
                autoComplete="tel"
              />
              {fieldErrors.phoneNumber && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.phoneNumber}</p>
              )}
            </L>

            <L
              label="Email Address *"
              hint="Required · booking voucher & itinerary sent here"
              className="sm:col-span-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.emailAddress) setFieldErrors((f) => ({ ...f, emailAddress: "" }));
                }}
                className={cn(inputCls, fieldErrors.emailAddress && "border-destructive")}
                placeholder="name@example.com"
                autoComplete="email"
              />
              {fieldErrors.emailAddress ? (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.emailAddress}</p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  We will send your trip confirmation and booking voucher directly to this email address.
                </p>
              )}
            </L>

            <L label="Special Requirements" hint="Optional" className="sm:col-span-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className={cn(inputCls, "h-auto py-3")}
                placeholder="Flight numbers, child seat, hotel pickup, multiple sightseeing spots, extra luggage…"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  "Airport pickup",
                  "Sightseeing itinerary",
                  "Child seat",
                  "Extra luggage",
                  "Senior citizen travelling",
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

      {/* Summary Sidebar */}
      <aside className="lg:sticky lg:top-24 rounded-[2rem] border border-border bg-card p-6 shadow-card">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Trip Fare</p>
          {matchedDestination && (
            <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold uppercase tracking-wider">
              {matchedDestination.typeLabel}
            </span>
          )}
        </div>

        <h3 className="mt-3 text-2xl font-semibold tracking-tight">{selectedVehicle.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {from || "—"} → {to || "—"}
          {!isFixedDayTrip && effectiveTripType === "round-trip" ? ` → ${from || "—"}` : ""}
        </p>

        <div className="mt-5 rounded-2xl bg-ink p-5 text-ink-foreground">
          {!hasValidRoute ? (
            <div className="py-3 text-center">
              <MapPin className="mx-auto size-5 text-gold/80" />
              <p className="mt-2 text-sm font-semibold text-foreground">
                Enter pickup & drop locations
              </p>
              <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                Please type full place names to calculate distance and view estimated fare.
              </p>
            </div>
          ) : isCalculatingRoute ? (
            <div className="py-4 text-center">
              <RefreshCw className="mx-auto size-5 animate-spin text-gold" />
              <p className="mt-2 text-xs font-semibold text-ink-muted">
                Calculating road distance…
              </p>
            </div>
          ) : activeFixedPrice ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  Package Fare <span className="text-gold font-normal lowercase">(approx.)</span>
                </p>
                <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold">
                  Day Package
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                <p className="text-3xl font-bold tracking-tight text-gold">
                  {inr(activeFixedPrice)}
                </p>
                <span className="rounded-md bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold">
                  approx.
                </span>
              </div>
              <p className="mt-2 text-xs text-ink-muted">
                Fixed package for Ooty → {matchedDestination?.name} ({selectedVehicle.name})
              </p>
            </>
          ) : estimate ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  Estimated fare <span className="text-gold font-normal lowercase">(approx.)</span>
                </p>
                {routeInfo?.source === "osrm" && (
                  <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold">
                    Live Route
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                <p className="text-3xl font-bold tracking-tight">
                  {inr(estimate.low)}{" "}
                  <span className="text-base font-medium text-ink-muted">– {inr(estimate.high)}</span>
                </p>
                <span className="rounded-md bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold">
                  approx.
                </span>
              </div>
              <p className="mt-2 text-xs text-ink-muted">
                ≈ {estimate.km} km ·{" "}
                {effectiveTripType === "one-way"
                  ? `${inr(selectedVehicle.pricing.oneWayPerKm)}/km`
                  : `${inr(selectedVehicle.pricing.roundTripPerKm)}/km · ${estimate.days} day${estimate.days > 1 ? "s" : ""}`}
              </p>
            </>
          ) : (
            <div className="py-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                Custom Route
              </p>
              <p className="mt-1 text-base font-semibold">Custom itinerary</p>
              <p className="mt-1 text-xs text-ink-muted">
                Enter your pickup and destination to view live fare estimates.
              </p>
            </div>
          )}
        </div>

        {/* Pricing disclaimer note: Rates are not fixed and might be lesser */}
        <div className="mt-4 rounded-xl border border-gold/30 bg-gold-soft/30 p-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Info className="size-4 shrink-0 text-gold mt-0.5" />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              <strong className="text-foreground font-semibold">Fare is approximate: </strong>
              No rate is strictly fixed — your final fare might be <span className="text-gold font-semibold">lesser than the estimated fare</span> depending on your exact itinerary, sightseeing spots, and season.
            </p>
          </div>
        </div>

        <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
          <li className="flex gap-2 text-foreground font-medium">
            <Sparkles className="size-3.5 shrink-0 text-gold" />
            Driver allowance included in fare
          </li>
          <li className="flex gap-2 text-foreground font-medium">
            <Info className="size-3.5 shrink-0 text-gold" />
            Toll, parking & state permits are NOT included (billed at actuals as they vary state to state)
          </li>
          <li className="flex gap-2 text-foreground font-medium">
            <CheckCircle2 className="size-3.5 shrink-0 text-gold" />
            Final fare confirmed before trip start — no hidden charges
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
              <RefreshCw className="size-4 animate-spin" /> Submitting Request…
            </span>
          ) : (
            "Request Booking"
          )}
        </Button>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          No advance payment required now. Our team confirms availability and driver details first.
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
