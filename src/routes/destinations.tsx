import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { DestinationCard } from "@/components/site/DestinationCard";
import { Reveal } from "@/components/site/Reveal";
import ootyImg from "@/assets/destinations/ooty.jpg";
import { destinations, inr, categories, estimateFare } from "@/data/site";

const title = "Destinations from Ooty — Mysore, Coorg, Kerala | Rashe Holidays";
const description =
  "Popular routes and tour destinations from Ooty: Mysore, Coimbatore, Bangalore, Chennai, Kerala and Coorg, with distances, travel times and indicative fares.";

export const Route = createFileRoute("/destinations")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: DestinationsPage,
});

function DestinationsPage() {
  const rows = destinations.filter((d) => d.slug !== "ooty");
  return (
    <>
      <PageHero
        eyebrow="Destinations"
        title="Everywhere the"
        accent="hills lead"
        image={ootyImg}
        description="Day trips down the ghats, airport transfers and multi-day tours across Tamil Nadu, Karnataka and Kerala."
      />

      <section className="section-y">
        <div className="container-x">
          <SectionHeading eyebrow="Popular Routes" title="Choose your" accent="destination" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d, i) => (
              <Reveal key={d.slug} delay={i * 50}>
                <DestinationCard d={d} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Indicative Fares"
            title="One-way estimates"
            accent="from Ooty"
            description="Approximate one-way fares including driver allowance. Tolls, parking and permits are billed at actuals."
          />
          <Reveal className="mt-10 overflow-x-auto rounded-3xl border border-border bg-card shadow-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-secondary/70 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-4 font-semibold">Route</th>
                  <th className="p-4 font-semibold">Distance</th>
                  <th className="p-4 font-semibold">Time</th>
                  {categories.map((c) => (
                    <th key={c.id} className="p-4 font-semibold">
                      {c.label.split(" ")[0]} Seater
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.slug} className="border-t border-border">
                    <th className="p-4 font-semibold text-foreground">Ooty → {d.name}</th>
                    <td className="p-4 text-muted-foreground">{d.kmFromOoty} km</td>
                    <td className="p-4 text-muted-foreground">{d.hours}</td>
                    {categories.map((c) => {
                      const f = estimateFare({
                        category: c.id,
                        tripType: "one-way",
                        from: "Ooty",
                        to: d.name === "Kerala" ? "Munnar" : d.name,
                      });
                      return (
                        <td key={c.id} className="p-4 text-muted-foreground">
                          {f ? `${inr(f.low)} – ${inr(f.high)}` : "On request"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <div className="mt-10">
            <Button asChild variant="gold" size="lg">
              <Link to="/booking">
                Get an exact quote <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
