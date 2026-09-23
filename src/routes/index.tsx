import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, PhoneCall } from "lucide-react";
import heroImg from "@/assets/hero-ooty.jpg";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { CategoryShowcase } from "@/components/site/CategoryShowcase";
import { HeroBookingForm } from "@/components/site/HeroBookingForm";
import { TripTypeCard } from "@/components/site/TripTypeCard";
import { DestinationCard } from "@/components/site/DestinationCard";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { HowItWorks } from "@/components/site/HowItWorks";
import { PricingTable } from "@/components/site/PricingTable";
import { FAQ } from "@/components/site/FAQ";
import { company, destinations, stats, testimonials, whatsappUrl } from "@/data/site";
import CountUp from "@/components/ui/CountUp";

const title = "Rashe Holidays — Premium Cab & Tempo Traveller Hire in Ooty";
const description =
  "Book premium 4-seater cars, Toyota Innova HyCross and 19-seater Travellers in Ooty. One-way and round trips across the Nilgiris, Mysore, Kerala and Bangalore with transparent pricing.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-ink pt-[72px] text-ink-foreground grain">
        <img
          src={heroImg}
          alt="Tea gardens and winding roads of the Nilgiri hills near Ooty"
          className="absolute inset-0 size-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/70 to-ink" />
        <div className="container-x relative grid w-full items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="min-w-0">
            <span className="eyebrow animate-fade-up">{company.tagline}</span>
            <h1 className="mt-5 max-w-2xl text-[2.75rem] font-semibold leading-[1.02] sm:text-6xl lg:text-7xl animate-fade-up [animation-delay:80ms]">
              Travel the Nilgiris in <span className="display italic text-gold">quiet comfort</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg animate-fade-up [animation-delay:160ms]">
              Well-kept cars, experienced hill-road drivers and clear per-kilometre pricing. Choose
              one-way or round trip, pick your vehicle, and we confirm within 30 minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-fade-up [animation-delay:240ms]">
              <Button asChild variant="gold" size="lg">
                <Link to="/vehicles">
                  Explore Vehicles <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline-light" size="lg">
                <a href={company.phoneHref}>
                  <PhoneCall /> {company.phone}
                </a>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-2 gap-6 sm:grid-cols-4 animate-fade-up [animation-delay:320ms]">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl font-semibold text-gold sm:text-3xl">
                    <CountUp to={s.target} separator={s.separator} duration={2} />
                    {s.suffix}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-ink-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="min-w-0 animate-fade-up [animation-delay:200ms]">
            <HeroBookingForm />
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section className="section-y">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our Fleet"
            title="Three categories,"
            accent="one standard"
            description="From a nimble hatchback for local sightseeing to a 19-seater for the whole group — every vehicle is sanitised, insured and driven by a hill-road specialist."
          />
          <CategoryShowcase />
        </div>
      </section>

      {/* Trip types */}
      <section className="bg-ink py-20 text-ink-foreground grain sm:py-28">
        <div className="container-x">
          <SectionHeading
            dark
            align="center"
            eyebrow="Trip Types"
            title="Choose how you"
            accent="travel"
            description="Two simple ways to book. Both include the driver, fuel and a fixed per-kilometre rate."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <TripTypeCard type="one-way" />
            <TripTypeCard type="round-trip" />
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="section-y">
        <div className="container-x">
          <SectionHeading
            eyebrow="Popular Routes"
            title="Where would you like"
            accent="to go?"
            description="Day trips, airport transfers and multi-day tours from Ooty."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.slice(1).map((d, i) => (
              <Reveal key={d.slug} delay={i * 60}>
                <DestinationCard d={d} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/destinations">
                All destinations <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-secondary/50 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Why Rashe Holidays"
            title="Built on trust,"
            accent="not luck"
            description="Fourteen years of driving these ghats, and a promise we keep on every trip."
          />
          <WhyChooseUs />
        </div>
      </section>

      {/* How it works */}
      <section className="section-y">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="How It Works"
            title="Booked in"
            accent="four steps"
          />
          <HowItWorks />
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-secondary/50 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="Transparent Pricing"
            title="Know the fare"
            accent="before you go"
            description="Clear per-km and per-day rates. Tolls, parking and permits at actuals."
          />
          <PricingTable />
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-y">
        <div className="container-x">
          <SectionHeading
            eyebrow="Guest Stories"
            title="12,000+ journeys,"
            accent="one rating"
            description="Rated 4.9 out of 5 by travellers across India and abroad."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 60}>
                <TestimonialCard t={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/50 py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions,"
            accent="answered"
            description="Still unsure? Message us on WhatsApp and a travel planner will reply."
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <div>
            <FAQ />
            <div className="mt-8">
              <Button asChild variant="outline" size="lg">
                <a href={whatsappUrl()} target="_blank" rel="noreferrer">
                  Ask on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
