import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import aboutImg from "@/assets/about-ooty.jpg";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { company, stats, testimonials } from "@/data/site";
import CountUp from "@/components/ui/CountUp";
import { pageHead } from "@/lib/seo";

const title = "About Rashe Holidays — Ooty Travels & Taxi Service";
const description =
  "Fourteen years of driving the Nilgiri ghats. Meet the Ooty-based travel team behind 25,000+ safe, comfortable journeys across South India.";

export const Route = createFileRoute("/about")({
  head: () => pageHead({ title, description, path: "/about" }),
  component: AboutPage,
});

const values = [
  {
    t: "Local by nature",
    d: "We live in Ooty. Our drivers know every hairpin, viewpoint and shortcut in the Nilgiris — and when the fog rolls in.",
  },
  {
    t: "Clear communication",
    d: "Your route, vehicle and timings are confirmed before the trip, with updates on call or WhatsApp along the way.",
  },
  {
    t: "Cared-for vehicles",
    d: "Every car is serviced on schedule, sanitised before pickup and insured. If anything ever falters, a replacement is on its way.",
  },
  {
    t: "Drivers you trust",
    d: "Verified, uniformed, trained in hill driving and courteous with families, elders and first-time visitors alike.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Fourteen years on"
        accent="these hills"
        image={aboutImg}
        description={`${company.name} began with a single sedan and a simple idea: travellers in the Nilgiris deserve clean vehicles, fair prices and drivers who genuinely know the roads.`}
      >
        <Button asChild variant="gold" size="lg">
          <Link to="/booking">
            Plan a trip <ArrowRight />
          </Link>
        </Button>
      </PageHero>

      <section className="section-y">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            eyebrow="Our Story"
            title="From one sedan to a"
            accent="full fleet"
            description="What started as airport runs down the Mettupalayam ghat is now a five-category fleet serving families, corporates and tour groups across Tamil Nadu, Karnataka and Kerala. The team has grown, the standards haven't moved."
          />
          <Reveal className="grid grid-cols-2 gap-6 self-center">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-3xl border border-border bg-card p-6 shadow-card"
              >
                <p className="text-3xl font-semibold text-foreground">
                  <CountUp to={s.target} separator={s.separator} duration={2} />
                  {s.suffix}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="container-x">
          <Reveal className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-7 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div className="flex items-center gap-5">
              <span className="grid size-16 shrink-0 place-items-center rounded-full bg-ink text-lg font-bold text-ink-foreground">
                {company.owner.initials}
              </span>
              <div>
                <p className="eyebrow">Meet the Owner</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {company.owner.name}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {company.owner.role}, {company.name}
                </p>
              </div>
            </div>
            <Button asChild variant="gold" size="lg" className="self-start sm:self-auto">
              <a href={company.phone2Href}>
                <Phone /> {company.phone2}
              </a>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-20 text-ink-foreground grain sm:py-28">
        <div className="container-x">
          <SectionHeading
            dark
            eyebrow="What We Stand For"
            title="Four things we"
            accent="never compromise"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={i * 60}>
                <div className="h-full rounded-3xl border border-ink-border bg-ink-foreground/[0.04] p-7">
                  <h3 className="text-xl font-semibold">{v.t}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <SectionHeading
            eyebrow="Why Travellers Return"
            title="The promise on"
            accent="every trip"
          />
          <WhyChooseUs />
        </div>
      </section>

      <section className="bg-secondary/50 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Guest Stories" title="In their" accent="words" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 60}>
                <TestimonialCard t={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
