import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TripTypeCard } from "@/components/site/TripTypeCard";
import { PricingTable } from "@/components/site/PricingTable";
import { Reveal } from "@/components/site/Reveal";

const title = "Trip Types — One Way & Round Trip Cabs | Rashe Holidays";
const description =
  "Understand the difference between one-way and round-trip cab bookings in Ooty, how fares are calculated, and which option suits your journey.";

export const Route = createFileRoute("/trip-types")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: TripTypes,
});

const compare = [
  { label: "Journey", one: "Pickup to destination only", round: "Destination and back to pickup" },
  {
    label: "Billing",
    one: "Per km, one direction (min 100 km)",
    round: "Per km round distance, min 250 km/day",
  },
  { label: "Duration", one: "Single day", round: "One or multiple days" },
  { label: "Driver allowance", one: "Charged once", round: "Charged per day" },
  {
    label: "Best for",
    one: "Airport drops, relocations",
    round: "Sightseeing, family tours, corporate trips",
  },
];

function TripTypes() {
  return (
    <>
      <PageHero
        eyebrow="Trip Types"
        title="One way or"
        accent="round trip?"
        description="Two straightforward ways to travel with us. Pick the one that matches your plan — both include driver, fuel and a fixed per-kilometre rate."
      >
        <Button asChild variant="gold" size="lg">
          <Link to="/booking">
            Start Booking <ArrowRight />
          </Link>
        </Button>
      </PageHero>

      <section className="bg-ink pb-20 text-ink-foreground grain sm:pb-28">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <TripTypeCard type="one-way" />
          <TripTypeCard type="round-trip" />
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <SectionHeading eyebrow="Side by Side" title="Compare the" accent="two options" />
          <Reveal className="mt-10 max-w-none overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/70 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-4 font-semibold">&nbsp;</th>
                  <th className="p-4 font-semibold">One Way Trip</th>
                  <th className="p-4 font-semibold">Round Trip</th>
                </tr>
              </thead>
              <tbody>
                {compare.map((r) => (
                  <tr key={r.label} className="border-t border-border align-top">
                    <th className="p-4 font-semibold text-foreground">{r.label}</th>
                    <td className="p-4 text-muted-foreground">{r.one}</td>
                    <td className="p-4 text-muted-foreground">{r.round}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/50 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="Rates"
            title="Fares for every"
            accent="category"
          />
          <PricingTable />
        </div>
      </section>
    </>
  );
}
