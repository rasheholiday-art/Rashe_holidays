import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Clock,
  Compass,
  MapPin,
  Plane,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DestinationCard } from "@/components/site/DestinationCard";
import { WhatsAppIcon } from "@/components/site/WhatsAppButton";
import {
  destinationBySlug,
  destinations,
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
    const fleetNote = "Sedans, Innovas, Travellers and Urbania with hill-trained drivers";
    const includesOoty = d.name.includes("Ooty");
    const title =
      d.type === "transfer"
        ? `Ooty to ${d.name} Taxi — Pickup & Drop | Rashe Holidays`
        : includesOoty
          ? `${d.name} Sightseeing Taxi & Day Tour | Rashe Holidays`
          : `${d.name} Sightseeing Taxi from Ooty | Rashe Holidays`;
    const description =
      d.type === "transfer"
        ? `Ooty to ${d.name} taxi: ${d.kmFromOoty} km, ${d.hours}. ${fleetNote}.`
        : fitText(
            [3, 2, 1].map(
              (n) =>
                `${d.name} sightseeing by taxi${includesOoty ? "" : " from Ooty"}: ${d.highlights.slice(0, n).join(", ")}. ${fleetNote}.`,
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
  const related = destinations.filter((item) => item.slug !== d.slug).slice(0, 3);

  const bookingSummary = `Hi Rashe Holidays! I'd like to book a trip from Ooty to ${d.name} (${d.typeLabel}) . Please share vehicle options and availability.`;

  return (
    <>
      {/* Top Hero / Header */}
      <section className="relative overflow-hidden bg-shade pt-[72px] text-ink-foreground grain">
        <img
          src={d.image}
          alt=""
          className="absolute inset-0 size-full object-cover object-center opacity-50 sm:opacity-60 brightness-[1.02] contrast-[1.05]"
        />
        {/* Soft directional overlays to keep text and badge details high-contrast while revealing the destination scene */}
        <div className="absolute inset-0 bg-gradient-to-r from-shade/95 via-shade/80 to-shade/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-shade via-transparent to-shade/35" />
        <div className="container-x relative py-10 lg:py-14">
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
              <div className="absolute inset-0 bg-gradient-to-t from-shade/90 via-shade/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-ink-foreground">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gold">
                    Origin Station
                  </p>
                  <p className="text-xl font-bold">Ooty (Queen of Hills)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book this trip */}
      <section className="section-y bg-background">
        <div className="container-x">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-card sm:p-10 lg:grid lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-10">
            <div>
              <span className="eyebrow">Plan This Trip</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Ooty to <span className="display italic font-normal text-gold">{d.name}</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {d.type === "sightseeing"
                  ? "A fixed day-tour route starting from Ooty."
                  : `A fixed direct pickup or drop between Ooty and ${d.name}.`}{" "}
                Choose any vehicle from our fleet when you book, from a 4-seater sedan to a
                16-seater Urbania.
              </p>

              <ul className="mt-6 space-y-2.5 text-sm">
                <li className="flex items-center gap-2.5 font-medium text-foreground">
                  <Clock className="size-4 shrink-0 text-gold" />
                  {d.hours}
                  {d.kmFromOoty > 0 ? ` · about ${d.kmFromOoty} km from Ooty` : ""}
                </li>
                <li className="flex items-center gap-2.5 font-medium text-foreground">
                  <Users className="size-4 shrink-0 text-gold" />
                  Vehicles for 4 to 16 passengers
                </li>
                <li className="flex items-center gap-2.5 font-medium text-foreground">
                  <ShieldCheck className="size-4 shrink-0 text-gold" />
                  Sanitised interiors, experienced hill-road drivers and a 24/7 travel desk
                </li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col justify-between rounded-2xl border border-ink-border bg-ink p-6 text-ink-foreground lg:mt-0">
              <p className="text-sm leading-relaxed text-ink-muted">
                Send us your date and group size. Our team will call you back to confirm the
                vehicle and timings.
              </p>

              <div className="mt-6 space-y-3">
                <Button asChild variant="gold" size="xl" className="w-full">
                  <Link
                    to="/booking"
                    search={{
                      from: "Ooty",
                      to: d.name,
                      tripType: d.type === "sightseeing" ? "round-trip" : "one-way",
                      destinationSlug: d.slug,
                    }}
                  >
                    Book This Trip <ArrowRight />
                  </Link>
                </Button>

                <Button asChild variant="outline-light" size="lg" className="w-full">
                  <a href={whatsappUrl(bookingSummary)} target="_blank" rel="noreferrer">
                    <WhatsAppIcon className="size-4" /> Book via WhatsApp
                  </a>
                </Button>
              </div>

              <p className="mt-4 text-center text-[11px] text-ink-muted">
                No advance payment needed.
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
