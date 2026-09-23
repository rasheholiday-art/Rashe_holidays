import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { VehicleCard } from "@/components/site/VehicleCard";
import { Reveal } from "@/components/site/Reveal";
import { PricingTable } from "@/components/site/PricingTable";
import { vehiclesSearchSchema } from "@/lib/booking-search";
import { categories, vehicles } from "@/data/site";
import { cn } from "@/lib/utils";

const title = "Our Vehicles — Cars, Innova HyCross & 19 Seater | Rashe Holidays";
const description =
  "Browse our Ooty fleet: 4-seater sedans and hatchbacks, the Toyota Innova HyCross and 19-seater Travellers. Compare seating, luggage, ratings and per-km pricing.";

export const Route = createFileRoute("/vehicles/")({
  validateSearch: vehiclesSearchSchema,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: VehiclesPage,
});

function VehiclesPage() {
  const { category } = Route.useSearch();
  const navigate = useNavigate();
  const list = category ? vehicles.filter((v) => v.category === category) : vehicles;
  const active = category ?? "all";

  const filters = [
    { id: "all" as const, label: "All Vehicles" },
    ...categories.map((c) => ({ id: c.id, label: c.label })),
  ];

  return (
    <>
      <PageHero
        eyebrow="Our Fleet"
        title="Pick the vehicle that"
        accent="fits your trip"
        image={vehicles[0]!.images[0]!}
        description="Seven vehicles across three categories — every one sanitised, insured and driven by a hill-road specialist."
      />

      <section className="section-y">
        <div className="container-x">
          <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() =>
                  navigate({ to: "/vehicles", search: f.id === "all" ? {} : { category: f.id } })
                }
                className={cn(
                  "shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                  active === f.id
                    ? "border-ink bg-ink text-ink-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Showing {list.length} {list.length === 1 ? "vehicle" : "vehicles"}
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((v, i) => (
              <Reveal key={v.slug} delay={i * 60}>
                <VehicleCard vehicle={v} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="Pricing"
            title="Rates for every"
            accent="category"
          />
          <PricingTable />
          <div className="mt-12 text-center">
            <Button asChild variant="gold" size="lg">
              <Link to="/booking">
                Book Your Ride <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
