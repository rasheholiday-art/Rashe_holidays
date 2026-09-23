import { useNavigate } from "@tanstack/react-router";
import { ArrowLeftRight, ArrowRight, CalendarDays, MapPin, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { categories, locations, type CategoryId } from "@/data/site";
import { cn } from "@/lib/utils";

const inputCls =
  "h-11 w-full rounded-xl border border-input bg-card px-3.5 text-sm font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold focus:ring-2 focus:ring-gold/30";

export function HeroBookingForm() {
  const navigate = useNavigate();

  // Today's date in local YYYY-MM-DD
  const todayStr = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, []);

  const [tripType, setTripType] = useState<"one-way" | "round-trip">("round-trip");
  const [category, setCategory] = useState<CategoryId>("8-seater");
  const [from, setFrom] = useState("Ooty");
  const [to, setTo] = useState("Mysore");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(4);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate({
          to: "/booking",
          search: {
            tripType,
            category,
            from,
            to,
            date: date || undefined,
            returnDate: tripType === "round-trip" ? returnDate || undefined : undefined,
            passengers,
          },
        });
      }}
      className="rounded-3xl border border-border/60 bg-card/95 p-4 shadow-float backdrop-blur-xl sm:p-6"
      aria-label="Check availability"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="radiogroup"
          aria-label="Trip type"
          className="inline-flex rounded-full bg-secondary p-1"
        >
          {(["one-way", "round-trip"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={tripType === t}
              onClick={() => setTripType(t)}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all",
                tripType === t
                  ? "bg-ink text-ink-foreground shadow"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t === "one-way" ? (
                <ArrowRight className="size-4" />
              ) : (
                <ArrowLeftRight className="size-4" />
              )}
              {t === "one-way" ? "One Way" : "Round Trip"}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              aria-pressed={category === c.id}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                category === c.id
                  ? "border-gold bg-gold-soft text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/40",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Pickup" icon={<MapPin className="size-4" />}>
          <input
            list="hero-pickup-locs"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={inputCls}
            placeholder="e.g. Ooty"
            aria-label="Pickup location"
          />
          <datalist id="hero-pickup-locs">
            {locations.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
        </Field>
        <button
          type="button"
          onClick={swap}
          aria-label="Swap pickup and destination"
          className="hidden size-11 place-items-center self-start rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-gold hover:text-gold"
        >
          <ArrowLeftRight className="size-4" />
        </button>
        <Field label="Destination" icon={<MapPin className="size-4" />}>
          <input
            list="hero-drop-locs"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={inputCls}
            placeholder="e.g. Mysore, Bangalore…"
            aria-label="Destination"
          />
          <datalist id="hero-drop-locs">
            {locations.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
        </Field>
        <Field label="Departure" icon={<CalendarDays className="size-4" />}>
          <input
            type="date"
            min={todayStr}
            value={date}
            onChange={(e) => {
              const nextDate = e.target.value;
              setDate(nextDate);
              if (returnDate && returnDate < nextDate) {
                setReturnDate(nextDate);
              }
            }}
            className={inputCls}
            aria-label="Departure date"
          />
        </Field>
        {tripType === "round-trip" && (
          <Field label="Return" icon={<CalendarDays className="size-4" />}>
            <input
              type="date"
              value={returnDate}
              min={date && date >= todayStr ? date : todayStr}
              onChange={(e) => setReturnDate(e.target.value)}
              className={inputCls}
              aria-label="Return date"
            />
          </Field>
        )}
        <Field label="Passengers" icon={<Users className="size-4" />}>
          <select
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className={inputCls}
            aria-label="Number of passengers"
          >
            {Array.from({ length: 19 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "passenger" : "passengers"}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex items-end sm:col-span-2">
          <Button type="submit" variant="gold" size="lg" className="h-11 w-full">
            <Search /> Check Availability
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
