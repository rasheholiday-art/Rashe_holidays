import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Luggage, Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { Stars } from "@/components/site/Stars";
import { AvailabilityDot } from "@/components/site/AvailabilityDot";
import { VehicleCard } from "@/components/site/VehicleCard";
import { company, inr, vehicleBySlug, vehicles, whatsappUrl } from "@/data/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vehicles/$slug")({
  loader: ({ params }) => {
    const vehicle = vehicleBySlug(params.slug);
    if (!vehicle) throw notFound();
    return { vehicle };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Vehicle not found — Rashe Holidays" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const v = loaderData.vehicle;
    const title = `${v.name} — ${v.seats} Seater Hire in Ooty | Rashe Holidays`;
    const description = `${v.tagline}. ${v.description}`.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: VehicleDetail,
});

function VehicleDetail() {
  const { vehicle: v } = Route.useLoaderData();
  const [img, setImg] = useState(0);
  const related = vehicles.filter((o) => o.slug !== v.slug).slice(0, 3);
  const p = v.pricing;

  return (
    <>
      {/* Gallery + summary */}
      <section className="bg-ink pt-[72px] text-ink-foreground grain">
        <div className="container-x grid gap-10 py-12 lg:grid-cols-[1.15fr_1fr] lg:py-16">
          <div>
            <div className="overflow-hidden rounded-[2rem] border border-ink-border bg-ink-foreground/5">
              <img
                src={v.images[img]}
                alt={`${v.name} — photo ${img + 1}`}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            {v.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {v.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setImg(i)}
                    aria-label={`Show photo ${i + 1}`}
                    className={cn(
                      "overflow-hidden rounded-xl border transition-opacity",
                      i === img ? "border-gold" : "border-ink-border opacity-60 hover:opacity-100",
                    )}
                  >
                    <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow">{v.categoryLabel}</span>
              <AvailabilityDot available={v.available} onDark />
            </div>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] sm:text-5xl">{v.name}</h1>
            <p className="mt-3 text-base text-ink-muted sm:text-lg">{v.tagline}</p>
            <div className="mt-4 flex items-center gap-3 text-sm text-ink-muted">
              <Stars rating={v.rating} />
              <span>
                {v.rating} · {v.reviews} reviews
              </span>
            </div>

            <dl className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: Users, k: "Seats", val: `${v.seats}` },
                { icon: Luggage, k: "Luggage", val: v.luggage },
                { icon: Check, k: "Type", val: v.type },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-2xl border border-ink-border bg-ink-foreground/[0.04] p-4"
                >
                  <s.icon className="size-4 text-gold" />
                  <dt className="mt-3 text-[11px] uppercase tracking-wider text-ink-muted">
                    {s.k}
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold">{s.val}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 rounded-2xl border border-ink-border bg-ink-foreground/[0.04] p-5">
              <p className="text-xs uppercase tracking-wider text-ink-muted">Starting from</p>
              <p className="mt-1 text-3xl font-semibold text-gold">
                {inr(p.roundTripPerKm)}
                <span className="text-base font-medium text-ink-muted"> / km round trip</span>
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                {inr(p.oneWayPerKm)}/km one way · {inr(p.perDay)} per day (min {p.minKmPerDay} km) ·
                driver allowance {inr(p.driverAllowance)}/day
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="gold" size="lg">
                <Link to="/booking" search={{ category: v.category, vehicle: v.slug }}>
                  Book This Vehicle <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline-light" size="lg">
                <a
                  href={whatsappUrl(`Hi! I'd like to enquire about the ${v.name}.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline-light" size="lg">
                <a href={company.phoneHref}>
                  <Phone /> Call
                </a>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {v.suitableFor.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-ink-border px-3 py-1 text-xs font-semibold text-ink-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="section-y">
        <div className="container-x grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading
              eyebrow="Overview"
              title="About this"
              accent="vehicle"
              description={v.description}
            />
            <h3 className="mt-10 text-lg font-semibold text-foreground">
              Specifications & features
            </h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {v.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <Reveal className="rounded-3xl border border-border bg-card p-7 shadow-card sm:p-9">
            <h3 className="text-xl font-semibold text-foreground">Why choose the {v.shortName}</h3>
            <ul className="mt-6 space-y-4">
              {v.whyChoose.map((w) => (
                <li key={w} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                    <Check className="size-3" />
                  </span>
                  {w}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild className="w-full" variant="ink" size="lg">
                <Link to="/booking" search={{ category: v.category, vehicle: v.slug }}>
                  Check availability
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related */}
      <section className="bg-secondary/50 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Compare" title="Other vehicles you" accent="may like" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((o, i) => (
              <Reveal key={o.slug} delay={i * 60}>
                <VehicleCard vehicle={o} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/vehicles">
                View all vehicles <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
