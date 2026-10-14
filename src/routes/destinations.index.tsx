import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { DestinationCard } from "@/components/site/DestinationCard";
import { Reveal } from "@/components/site/Reveal";
import ootyImg from "@/assets/destinations/ooty.jpg";
import { destinations } from "@/data/site";
import { cn } from "@/lib/utils";
import { pageHead } from "@/lib/seo";

const title = "Ooty Sightseeing & Airport Taxi Packages | Rashe Holidays";
const description =
  "Fixed taxi fares from Ooty for Coonoor, Pykara and Mudumalai sightseeing, plus Coimbatore, Bangalore, Cochin, Calicut, and Trichy airport drops.";

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
            <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
              {[
                { id: "all" as const, label: `All Places (${destinations.length})` },
                {
                  id: "sightseeing" as const,
                  label: `Sightseeing (${destinations.filter((d) => d.type === "sightseeing").length})`,
                },
                {
                  id: "transfer" as const,
                  label: `Airport / Railway (${destinations.filter((d) => d.type === "transfer").length})`,
                },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                    filter === f.id
                      ? "border-ink bg-ink text-ink-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f.label}
                </button>
              ))}
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
    </>
  );
}
