import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Clock,
  Compass,
  Info,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DestinationCard } from "@/components/site/DestinationCard";
import { WhatsAppIcon } from "@/components/site/WhatsAppButton";
import {
  company,
  destinationBySlug,
  destinations,
  inr,
  vehicles,
  whatsappUrl,
} from "@/data/site";
import { cn } from "@/lib/utils";
import { breadcrumbJsonLd, fitText, jsonLdScript, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/destinations/$slug")({
  loader: ({ params }) => {
    const destination = destinationBySlug(params.slug);
    if (!destination) throw notFound();
    return { destination };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Destination Not Found — Rashe Holidays" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const d = loaderData.destination;
    const path = `/destinations/${d.slug}`;
    const [cheapestSlug, cheapestPrice] = Object.entries(d.fixedPrices).sort(
      (a, b) => a[1] - b[1],
    )[0]!;
    const cheapest = vehicles.find((v) => v.slug === cheapestSlug)?.shortName ?? "Sedan";
    const fromPrice = `Fixed fares from ${inr(cheapestPrice)} (${cheapest})`;
    const includesOoty = d.name.includes("Ooty");
    const title =
      d.type === "transfer"
        ? `Ooty to ${d.name} Taxi — Fixed Fares | Rashe Holidays`
        : includesOoty
          ? `${d.name} Sightseeing Taxi & Day Tour | Rashe Holidays`
          : `${d.name} Sightseeing Taxi from Ooty | Rashe Holidays`;
    const description =
      d.type === "transfer"
        ? `Ooty to ${d.name} taxi: ${d.kmFromOoty} km, ${d.hours}. ${fromPrice} with hill-trained drivers. Tolls and permits at actuals.`
        : fitText(
            [3, 2, 1].map(
              (n) =>
                `${d.name} sightseeing by taxi${includesOoty ? "" : " from Ooty"}: ${d.highlights.slice(0, n).join(", ")}. ${fromPrice}.`,
            ),
          );
    return {
      ...pageHead({
        title,
        description,
        path,
        image: { url: d.image, alt: `${d.name} — ${d.typeLabel.toLowerCase()} from Ooty` },
      }),
      scripts: [
        jsonLdScript(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Destinations", path: "/destinations" },
            { name: d.name, path },
          ]),
        ),
      ],
    };
  },
  component: DestinationDetail,
});

function DestinationDetail() {
  const { destination: d } = Route.useLoaderData();
  const [selectedVehicleSlug, setSelectedVehicleSlug] = useState<string>("crysta");

  const selectedVehicle =
    vehicles.find((v) => v.slug === selectedVehicleSlug) ?? vehicles[0];
  const price = d.fixedPrices[selectedVehicle.slug] ?? 0;

  const related = destinations.filter((item) => item.slug !== d.slug).slice(0, 3);

  const bookingSummary = `Hi Rashe Holidays! I'd like to book a trip from Ooty to ${d.name} (${d.typeLabel}) for a ${selectedVehicle.name} (${selectedVehicle.seats} seater). Fixed package fare: ${inr(price)}.`;

  return (
    <>
      {/* Top Hero / Header */}
      <section className="bg-ink pt-[72px] text-ink-foreground grain">
        <div className="container-x py-10 lg:py-14">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-ink-muted">
            <Link to="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/destinations" className="hover:text-gold transition-colors">
              Destinations
            </Link>
            <span>/</span>
            <span className="text-ink-foreground font-semibold">{d.name}</span>
          </nav>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur",
                    d.type === "sightseeing"
                      ? "bg-gold/20 text-gold border border-gold/30"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30",
                  )}
                >
                  {d.type === "sightseeing" ? (
                    <Compass className="size-3.5" />
                  ) : (
                    <Plane className="size-3.5" />
                  )}
                  {d.typeLabel}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-ink-foreground/10 px-3 py-1 text-xs font-semibold text-ink-muted">
                  <MapPin className="size-3.5 text-gold" /> Starting from Ooty
                </span>

                {d.kmFromOoty > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-ink-foreground/10 px-3 py-1 text-xs font-semibold text-ink-muted">
                    <Clock className="size-3.5 text-gold" /> {d.hours} ({d.kmFromOoty} km)
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {d.name}
              </h1>

              <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
                {d.blurb}
              </p>

              {/* Highlights */}
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gold">
                  Trip Highlights & Key Spots
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.highlights.map((h) => (
                    <span
                      key={h}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-ink-border bg-ink-foreground/5 px-3 py-1.5 text-xs text-ink-foreground"
                    >
                      <Check className="size-3 text-gold" /> {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative overflow-hidden rounded-[2rem] border border-ink-border bg-ink-foreground/5 shadow-2xl">
              <img
                src={d.image}
                alt={`${d.name} from Ooty`}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-ink-foreground">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gold">
                    Origin Station
                  </p>
                  <p className="text-xl font-bold">Ooty (Queen of Hills)</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gold">
                    Fixed Rates From
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {inr(Math.min(...Object.values(d.fixedPrices)))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Car Selection & Fixed Pricing Section */}
      <section className="section-y bg-background">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Vehicle Pricing</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Choose your car for <span className="display italic font-normal text-gold">{d.name}</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Click any vehicle below to inspect the fixed package rate, passenger capacity, and instant booking details.
            </p>
          </div>

          {/* 6 Vehicles Grid */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => {
              const carPrice = d.fixedPrices[v.slug] ?? 0;
              const isSelected = selectedVehicle.slug === v.slug;

              return (
                <button
                  key={v.slug}
                  type="button"
                  onClick={() => setSelectedVehicleSlug(v.slug)}
                  className={cn(
                    "group relative flex flex-col text-left rounded-3xl border p-5 transition-all duration-300",
                    isSelected
                      ? "border-gold bg-gold-soft/50 ring-2 ring-gold/40 shadow-card"
                      : "border-border bg-card hover:border-gold/60 hover:shadow-card-hover",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                      {v.categoryLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <Users className="size-3.5 text-gold" /> {v.seats} Seats
                    </span>
                  </div>

                  {/* Vehicle Image */}
                  <div className="my-4 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted/40 p-2 flex items-center justify-center">
                    <img
                      src={v.images[0]}
                      alt={v.name}
                      className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground">{v.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {v.tagline}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="mt-4 pt-4 border-t border-border/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                        Fixed Fare
                      </span>
                      <span className="text-2xl font-bold tracking-tight text-foreground">
                        {carPrice ? inr(carPrice) : "On request"}
                      </span>
                    </div>

                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-bold transition-colors",
                        isSelected
                          ? "bg-gold text-ink"
                          : "bg-secondary text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Selection Summary Card & Book Now CTA */}
          <div className="mt-12 rounded-[2rem] border border-gold/40 bg-card p-6 shadow-xl sm:p-10 lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-10 lg:items-center">
            <div>
              <span className="eyebrow">Trip Summary</span>
              <h3 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                Ooty → {d.name} in {selectedVehicle.name}
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-background p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Starting Place
                  </span>
                  <span className="mt-1 font-semibold text-foreground flex items-center gap-1">
                    <MapPin className="size-3.5 text-gold" /> Ooty
                  </span>
                </div>

                <div className="rounded-2xl border border-border bg-background p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Destination
                  </span>
                  <span className="mt-1 font-semibold text-foreground">{d.name}</span>
                </div>

                <div className="rounded-2xl border border-border bg-background p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Car Selected
                  </span>
                  <span className="mt-1 font-semibold text-foreground">
                    {selectedVehicle.shortName} ({selectedVehicle.seats}s)
                  </span>
                </div>
              </div>

              <ul className="mt-6 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2 text-foreground font-medium">
                  <Sparkles className="size-4 text-gold shrink-0" />
                  Includes dedicated vehicle, fuel, and experienced hill-road driver allowance.
                </li>
                <li className="flex items-center gap-2 text-foreground font-medium">
                  <Info className="size-4 text-gold shrink-0" />
                  Toll, parking & state permit charges are NOT included and are billed at actuals as they vary state to state.
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-gold shrink-0" />
                  Sanitized interiors, luggage room, and 24/7 travel desk customer support.
                </li>
              </ul>
            </div>

            {/* Action Box */}
            <div className="mt-8 lg:mt-0 rounded-2xl bg-ink p-6 text-ink-foreground border border-ink-border flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-ink-muted">
                  Package Fare ({d.typeLabel})
                </p>
                <p className="mt-2 text-4xl font-bold text-gold tracking-tight">
                  {price ? inr(price) : "Contact Us"}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Fixed package rate for {selectedVehicle.name} ({selectedVehicle.seats} seater)
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <Button asChild variant="gold" size="xl" className="w-full">
                  <Link
                    to="/booking"
                    search={{
                      from: "Ooty",
                      to: d.name,
                      category: selectedVehicle.category,
                      vehicle: selectedVehicle.slug,
                      tripType: d.type === "sightseeing" ? "round-trip" : "one-way",
                      passengers: Math.min(4, selectedVehicle.seats),
                      fixedPrice: price,
                      destinationSlug: d.slug,
                    }}
                  >
                    Book Now with {selectedVehicle.shortName} <ArrowRight />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="w-full text-foreground">
                  <a href={whatsappUrl(bookingSummary)} target="_blank" rel="noreferrer">
                    <WhatsAppIcon className="size-4" /> Book via WhatsApp
                  </a>
                </Button>
              </div>

              <p className="mt-4 text-center text-[11px] text-ink-muted">
                No immediate payment required. We will confirm your travel timings and details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Other Destinations */}
      <section className="bg-secondary/40 py-20">
        <div className="container-x">
          <div className="flex items-center justify-between">
            <div>
              <span className="eyebrow">Explore More</span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Other popular destinations from Ooty
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/destinations">
                All Destinations <ArrowRight />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <DestinationCard key={item.slug} d={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
