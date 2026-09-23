import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { HowItWorks as Steps } from "@/components/site/HowItWorks";
import { FAQ } from "@/components/site/FAQ";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";

const title = "How It Works — Booking a Cab in Ooty | Rashe Holidays";
const description =
  "From choosing a vehicle to confirmation on WhatsApp — see exactly how booking a cab or Traveller with Rashe Holidays works, step by step.";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How It Works"
        title="Booking takes"
        accent="four steps"
        description="No app, no prepayment, no hidden charges. Send an enquiry and a travel planner confirms your vehicle, driver and final fare within 30 minutes."
      >
        <Button asChild variant="gold" size="lg">
          <Link to="/booking">
            Book Your Ride <ArrowRight />
          </Link>
        </Button>
      </PageHero>

      <section className="section-y">
        <div className="container-x">
          <Steps />
        </div>
      </section>

      <section className="bg-secondary/50 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="What You Get" title="Every trip" accent="includes" />
          <WhyChooseUs />
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="FAQ"
            title="Common"
            accent="questions"
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <FAQ />
        </div>
      </section>
    </>
  );
}
