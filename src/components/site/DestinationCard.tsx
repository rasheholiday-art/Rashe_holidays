import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Destination } from "@/data/site";
import { cn } from "@/lib/utils";

export function DestinationCard({ d, className }: { d: Destination; className?: string }) {
  return (
    <Link
      to="/booking"
      search={{
        from: "Ooty",
        to: d.name === "Kerala" ? "Kochi" : d.name,
        tripType: d.slug === "ooty" ? "round-trip" : "one-way",
      }}
      className={cn(
        "group img-zoom relative block aspect-[3/4] overflow-hidden rounded-3xl bg-ink text-ink-foreground shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover",
        className,
      )}
      aria-label={`Explore route to ${d.name}`}
    >
      <img
        src={d.image}
        alt={d.name}
        loading="lazy"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <span className="rounded-full bg-ink/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
          {d.state}
        </span>
        {d.kmFromOoty > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-ink/60 px-2.5 py-1 text-[10px] font-bold backdrop-blur">
            <Clock className="size-3 text-gold" />
            {d.hours}
          </span>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-2xl font-semibold tracking-tight">{d.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{d.blurb}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink-foreground px-3.5 py-1.5 text-xs font-bold text-ink transition-colors group-hover:bg-gold">
          Explore Route <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
