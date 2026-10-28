import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, PhoneCall } from "lucide-react";
import { useEffect, useState } from "react";
import hero1 from "@/assets/hero-1.webp";
import hero2 from "@/assets/hero-2.webp";
import hero3 from "@/assets/hero-3.webp";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { CategoryShowcase } from "@/components/site/CategoryShowcase";
import { TripTypeCard } from "@/components/site/TripTypeCard";
import { DestinationCard } from "@/components/site/DestinationCard";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { HowItWorks } from "@/components/site/HowItWorks";
import { FAQ } from "@/components/site/FAQ";
import { company, destinations, stats, testimonials, whatsappUrl } from "@/data/site";
import CountUp from "@/components/ui/CountUp";
import { businessJsonLd, jsonLdScript, pageHead, websiteJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

const heroSlides = [
  {
    src: hero1,
    alt: "Nilgiri Mountain Railway toy train through misty sunrise tea hills",
  },
  {
    src: hero2,
    alt: "Scenic turquoise mountain lake in the Nilgiris under bright blue sky",
  },
  {
    src: hero3,
    alt: "Lush green valley, tea plantations and lake waters in Ooty",
  },
];

const title = "Ooty Taxi, Cab & Traveller Booking | Rashe Holidays";
const description =
  "Ooty taxi & cab service: sedan, Innova Crysta, HyCross, Tavera, Traveller and Urbania with hill-trained drivers. Nilgiris sightseeing and airport transfers.";

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead({ title, description, path: "/" }),
    scripts: [jsonLdScript(businessJsonLd()), jsonLdScript(websiteJsonLd())],
  }),
  component: Index,
});

function Index() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-shade pt-[72px] text-ink-foreground grain">
        {/* Background Slideshow alternating every 3 seconds */}
        {heroSlides.map((slide, idx) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fetchPriority={idx === 0 ? "high" : "low"}
            className={cn(
              "absolute inset-0 size-full object-cover object-[center_35%] transition-opacity duration-1000 ease-in-out pointer-events-none",
              currentSlide === idx ? "opacity-100 z-[1]" : "opacity-0 z-0",
            )}
          />
        ))}

        {/* Subtle soft directional gradient: keeps text contrast clean on the left while keeping the scenic background bright and vivid */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-shade/80 via-shade/35 to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-shade/75 via-transparent to-transparent pointer-events-none" />

        {/* Slide Indicators */}
        <div className="container-x absolute bottom-4 left-0 right-0 z-20 hidden sm:flex items-center justify-end gap-2 pointer-events-auto">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              aria-label={`Switch to slide ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                currentSlide === i ? "w-7 bg-gold" : "w-2 bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>

        <div className="container-x relative z-10 w-full py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Original Eyebrow style */}
            <span className="eyebrow animate-fade-up">{company.tagline}</span>

            {/* Main Title */}
            <h1 className="mt-5 text-[2.6rem] font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl animate-fade-up [animation-delay:80ms]">
              Travel the Nilgiris in{" "}
              <span className="display italic text-gold font-normal">quiet comfort</span>
            </h1>

            {/* Descriptive Subtitle */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg animate-fade-up [animation-delay:160ms]">
              Well-kept cars, experienced hill-road drivers and a team you can reach 24/7. Choose
              one-way or round trip, pick your vehicle, and we confirm within 30 minutes.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5 animate-fade-up [animation-delay:240ms]">
              <Button asChild variant="gold" size="lg" className="shadow-lg shadow-gold/25 font-semibold">
                <Link to="/booking">
                  Book Your Ride <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline-light" size="lg">
                <Link to="/vehicles">
                  Explore Vehicles
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-ink-muted hover:text-white hover:bg-white/10">
                <a href={company.phoneHref}>
                  <PhoneCall className="size-4 text-gold" /> {company.phone}
                </a>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-ink-muted hover:text-white hover:bg-white/10">
                <a href={company.phone2Href}>
                  <PhoneCall className="size-4 text-gold" /> {company.phone2}
                </a>
              </Button>
            </div>

            {/* Stats: 0 opacity background (completely transparent, floating naturally on background) */}
            <dl className="mt-10 grid max-w-lg grid-cols-2 gap-6 sm:grid-cols-4 animate-fade-up [animation-delay:320ms]">
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
        </div>
      </section>

      {/* Fleet */}
      <section className="section-y">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our Fleet"
            title="Six vehicles,"
            accent="one standard"
            description="From a comfortable 4-seater sedan to a 16-seater Urbania — every vehicle is sanitised, insured and driven by a Nilgiri hill specialist."
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
            description="Two simple ways to book. Both come with an experienced hill-road driver."
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
            description="Sightseeing day trips and seamless airport transfers starting from Ooty."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.slice(0, 6).map((d, i) => (
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
            title="Book in"
            accent="four steps"
          />
          <HowItWorks />
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
