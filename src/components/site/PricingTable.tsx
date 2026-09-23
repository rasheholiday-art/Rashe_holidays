import { Link } from "@tanstack/react-router";
import { Info, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { categories, inr, vehiclesByCategory, type CategoryId } from "@/data/site";
import { cn } from "@/lib/utils";

export function PricingTable() {
  const [active, setActive] = useState<CategoryId>("8-seater");
  const cat = categories.find((c) => c.id === active)!;
  const hero = vehiclesByCategory(active)[0]!;

  return (
    <div className="mt-12">
      <div
        role="tablist"
        aria-label="Vehicle category"
        className="mx-auto inline-flex w-full max-w-md rounded-full bg-secondary p-1 sm:w-auto"
      >
        {categories.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={active === c.id}
            onClick={() => setActive(c.id)}
            className={cn(
              "flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all sm:px-6",
              active === c.id
                ? "bg-ink text-ink-foreground shadow"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {c.seats} Seater
          </button>
        ))}
      </div>

      <div
        key={active}
        className="mt-8 grid overflow-hidden rounded-[2rem] border border-border bg-card shadow-card animate-fade-up lg:grid-cols-[1fr_1.4fr]"
      >
        <div className="img-zoom relative min-h-[240px]">
          <img
            src={hero.images[0]}
            alt={cat.title}
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          <div className="absolute bottom-5 left-5 text-ink-foreground">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] opacity-75">
              Vehicle type
            </p>
            <p className="mt-1 text-2xl font-semibold">{cat.title}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm opacity-90">
              <Users className="size-4 text-gold" /> {cat.seats} passengers
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { l: "One Way Price", v: inr(cat.pricing.oneWayPerKm), u: "/ KM", d: "Min. 100 km" },
              {
                l: "Round Trip Price",
                v: inr(cat.pricing.roundTripPerKm),
                u: "/ KM",
                d: `Min. ${cat.pricing.minKmPerDay} km / day`,
              },
              {
                l: "Daily Rental",
                v: inr(cat.pricing.perDay),
                u: "/ Day",
                d: "8 hrs · 80 km local",
              },
            ].map((p, i) => (
              <div
                key={p.l}
                className={cn(
                  "rounded-2xl border p-4",
                  i === 1 ? "border-gold bg-gold-soft/60" : "border-border bg-background",
                )}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {p.l}
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight">
                  {p.v}
                  <span className="text-xs font-medium text-muted-foreground"> {p.u}</span>
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground text-xs">Driver allowance</dt>
              <dd className="font-semibold">{inr(cat.pricing.driverAllowance)} / day</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Night charges</dt>
              <dd className="font-semibold">After 10 pm · {inr(300)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Toll & parking</dt>
              <dd className="font-semibold">At actuals</dd>
            </div>
          </dl>
          <p className="mt-5 flex gap-2 rounded-xl bg-secondary p-3.5 text-xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-gold" />
            Final pricing may vary depending on distance, travel duration, toll charges, parking
            charges, driver allowance and other travel requirements.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="gold" size="lg">
              <Link to="/booking" search={{ category: active }}>
                Get Exact Quote
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/vehicles" search={{ category: active }}>
                See vehicles
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
