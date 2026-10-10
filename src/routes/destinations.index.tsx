import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Plane, ShieldCheck, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { DestinationCard } from "@/components/site/DestinationCard";
import { Reveal } from "@/components/site/Reveal";
import ootyImg from "@/assets/destinations/ooty.jpg";
import { destinations, inr, vehicles } from "@/data/site";
import { cn } from "@/lib/utils";
import { pageHead } from "@/lib/seo";

const title = "Ooty Sightseeing & Airport Taxi Packages | Rashe Holidays";
const description =
  "Fixed taxi fares from Ooty for Coonoor, Pykara and Mudumalai sightseeing, plus Coimbatore, Bangalore, Cochin, Calicut, Chennai and Trichy airport drops.";

export const Route = createFileRoute("/destinations/")({
  head: () => pageHead({ title, description, path: "/destinations" }),
  component: DestinationsPage,
});

type FilterType = "all" | "sightseeing" | "transfer";

function DestinationsPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered =
    filter === "all" ? destinations : destinations.filter((d) => d.type === filter);

  return (
    <>
      <PageHero
        eyebrow="Destinations"
        title="Everywhere from"
        accent="Ooty hills"
        image={ootyImg}
        description="Local sightseeing packages, scenic ghat descents, and timely airport transfers with fixed rates for every car."
      />

      <section className="section-y">
        <div className="container-x">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div>
              <span className="eyebrow">Explore Places</span>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Choose your <span className="display italic font-normal text-gold">destination</span>
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex rounded-full bg-secondary p-1 border border-border">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={cn(
                  "rounded-full px-5 py-2 text-xs font-bold transition-all sm:text-sm",
                  filter === "all"
                    ? "bg-ink text-ink-foreground shadow"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                All Places ({destinations.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("sightseeing")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold transition-all sm:text-sm",
                  filter === "sightseeing"
                    ? "bg-ink text-ink-foreground shadow"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Compass className="size-3.5 text-gold" />
                Sightseeing ({destinations.filter((d) => d.type === "sightseeing").length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("transfer")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold transition-all sm:text-sm",
                  filter === "transfer"
                    ? "bg-ink text-ink-foreground shadow"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Plane className="size-3.5 text-gold" />
                Airport / Railway ({destinations.filter((d) => d.type === "transfer").length})
              </button>
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            All trips originate from <span className="font-semibold text-foreground">Ooty</span>. Click any destination below to view fixed car pricing, photos, and book your ride.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d, i) => (
              <Reveal key={d.slug} delay={i * 45}>
                <DestinationCard d={d} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Fixed Price Comparison Table */}
      <section className="bg-secondary/50 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Transparent Rates"
            title="Fixed packages from"
            accent="Ooty"
            description="Fixed package rates for each destination according to your chosen car. Tolls, parking and state permits are billed at actuals as they vary state to state."
          />

          <Reveal className="mt-10 overflow-x-auto rounded-3xl border border-border bg-card shadow-card">
            <table className="w-full min-w-[840px] text-left text-sm">
              <thead className="bg-secondary/80 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-4 font-semibold">Destination</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Start Place</th>
                  {vehicles.map((v) => (
                    <th key={v.slug} className="p-4 font-semibold text-right">
                      {v.shortName} <span className="text-[10px] font-normal block opacity-75">({v.seats}s)</span>
                    </th>
                  ))}
                  <th className="p-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {destinations.map((d) => (
                  <tr key={d.slug} className="transition-colors hover:bg-secondary/40">
                    <th className="p-4 font-semibold text-foreground">
                      <Link
                        to="/destinations/$slug"
                        params={{ slug: d.slug }}
                        className="hover:text-gold transition-colors inline-flex items-center gap-1.5"
                      >
                        {d.name}
                      </Link>
                    </th>
                    <td className="p-4">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          d.type === "sightseeing"
                            ? "bg-gold/15 text-gold border border-gold/30"
                            : "bg-blue-500/15 text-blue-400 border border-blue-500/30",
                        )}
                      >
                        {d.typeLabel}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3 text-gold" /> Ooty
                      </span>
                    </td>
                    {vehicles.map((v) => {
                      const price = d.fixedPrices[v.slug];
                      return (
                        <td key={v.slug} className="p-4 text-right font-medium text-foreground">
                          {price ? inr(price) : "On request"}
                        </td>
                      );
                    })}
                    <td className="p-4 text-center">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/destinations/$slug" params={{ slug: d.slug }}>
                          View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-gold/10 text-gold">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Toll, Parking & State Permits
                </p>
                <p className="text-xs text-muted-foreground">
                  Billed at actuals during the journey as rates vary state to state. Base package includes car, fuel & hill driver allowance.
                </p>
              </div>
            </div>
            <Button asChild variant="gold" size="lg">
              <Link to="/booking">
                Custom Route Booking <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
