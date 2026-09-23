import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Briefcase, Snowflake, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { inr, type Vehicle } from "@/data/site";
import { cn } from "@/lib/utils";
import { Stars } from "./Stars";
import { AvailabilityDot } from "./AvailabilityDot";

export function VehicleCard({ vehicle, className }: { vehicle: Vehicle; className?: string }) {
  const v = vehicle;
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card-hover",
        className,
      )}
    >
      <Link
        to="/vehicles/$slug"
        params={{ slug: v.slug }}
        className="img-zoom relative block aspect-[4/3] bg-muted"
        aria-label={`View ${v.name}`}
      >
        <img src={v.images[0]} alt={v.name} loading="lazy" className="size-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <div className="flex gap-2">
            <span className="rounded-full bg-ink/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-foreground backdrop-blur">
              {v.categoryLabel}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1 text-xs font-bold text-foreground backdrop-blur">
            <Users className="size-3.5 text-gold" /> {v.seats} Seats
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <AvailabilityDot available={v.available} onDark />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-xl font-semibold tracking-tight">{v.name}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{v.tagline}</p>
          </div>
          <div className="shrink-0 text-right">
            <Stars rating={v.rating} size="size-3.5" />
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {v.rating} · {v.reviews} reviews
            </p>
          </div>
        </div>

        <ul className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-muted-foreground">
          <li className="rounded-xl bg-secondary py-2.5">
            <Users className="mx-auto mb-1 size-4 text-foreground" />
            {v.seats} Pax
          </li>
          <li className="rounded-xl bg-secondary py-2.5">
            <Briefcase className="mx-auto mb-1 size-4 text-foreground" />
            {v.luggage}
          </li>
          <li className="rounded-xl bg-secondary py-2.5">
            <Snowflake className="mx-auto mb-1 size-4 text-foreground" />
            Climate AC
          </li>
        </ul>

        <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              One way from
            </p>
            <p className="text-2xl font-bold tracking-tight">
              {inr(v.pricing.oneWayPerKm)}
              <span className="text-sm font-medium text-muted-foreground"> / km</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Day rental
            </p>
            <p className="text-base font-semibold">
              {inr(v.pricing.perDay)}
              <span className="text-xs font-medium text-muted-foreground"> / day</span>
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 transition-transform duration-500 group-hover:translate-y-0">
          <Button asChild variant="outline">
            <Link to="/vehicles/$slug" params={{ slug: v.slug }}>
              View Details <ArrowUpRight />
            </Link>
          </Button>
          <Button asChild variant="gold" className="opacity-90 group-hover:opacity-100">
            <Link to="/booking" search={{ category: v.category, vehicle: v.slug }}>
              Book Now
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
