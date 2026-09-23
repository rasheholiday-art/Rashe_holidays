import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import aboutImg from "@/assets/about-ooty.jpg";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { company, stats, testimonials } from "@/data/site";
import CountUp from "@/components/ui/CountUp";

const title = "About Rashe Holidays — Ooty Travels & Transportation";
const description =
  "Fourteen years of driving the Nilgiri ghats. Meet the Ooty-based travel team behind 25,000+ safe, comfortable journeys across South India.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    t: "Local by nature",
    d: "We live in Ooty. Our drivers know every hairpin, viewpoint and shortcut in the Nilgiris — and when the fog rolls in.",
  },
  {
    t: "Honest pricing",
    d: "Per-kilometre rates shared upfront, tolls and permits itemised at actuals. No surge, no surprise additions after the trip.",
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
            description="What started as airport runs down the Mettupalayam ghat is now a three-category fleet serving families, corporates and tour groups across Tamil Nadu, Karnataka and Kerala. The team has grown, the standards haven't moved."
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
