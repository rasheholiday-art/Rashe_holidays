import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { FAQ } from "@/components/site/FAQ";
import { company, whatsappUrl } from "@/data/site";

const title = "Contact Rashe Holidays — Ooty Travels & Cab Booking";
const description =
  "Call, WhatsApp or visit Rashe Holidays at Commercial Road, Ooty. Open 24 hours for cab bookings, airport transfers and tour planning across the Nilgiris.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ContactPage,
});

const cards = [
  { icon: Phone, label: "Call us", value: company.phone, href: company.phoneHref },
  { icon: MessageCircle, label: "WhatsApp", value: "Chat with a planner", href: whatsappUrl() },
  { icon: Mail, label: "Email", value: company.email, href: `mailto:${company.email}` },
  {
    icon: ShieldAlert,
    label: "24×7 emergency",
    value: company.emergency,
    href: company.emergencyHref,
  },
];

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We're here,"
        accent="around the clock"
        description="Whether it's a 5 am airport pickup or a last-minute change of plan, someone from our team is always reachable."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="gold" size="lg">
            <a href={company.phoneHref}>
              <Phone /> {company.phone}
            </a>
          </Button>
          <Button asChild variant="outline-light" size="lg">
            <a href={whatsappUrl()} target="_blank" rel="noreferrer">
              WhatsApp us
            </a>
          </Button>
        </div>
      </PageHero>

      <section className="section-y">
        <div className="container-x">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c, i) => (
              <Reveal key={c.label} delay={i * 60}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-foreground">
                    <c.icon className="size-5" />
                  </span>
                  <span className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {c.label}
                  </span>
                  <span className="mt-1 text-base font-semibold text-foreground">{c.value}</span>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-3xl border border-border bg-card p-7 shadow-card sm:p-9">
                <SectionHeading eyebrow="Visit us" title="Our office in" accent="Ooty" />
                <ul className="mt-8 space-y-5 text-sm">
                  <li className="flex gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-gold" />
                    <span className="text-muted-foreground">{company.address}</span>
                  </li>
                  <li className="flex gap-3">
                    <Clock className="mt-0.5 size-5 shrink-0 text-gold" />
                    <span className="text-muted-foreground">{company.hours}</span>
                  </li>
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild variant="gold">
                    <Link to="/booking">Book a ride</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/vehicles">See vehicles</Link>
                  </Button>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="h-full overflow-hidden rounded-3xl border border-border shadow-card">
                <iframe
                  title="Rashe Holidays location in Ooty"
                  src={company.mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[420px] w-full lg:h-full"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="FAQ"
            title="Before you"
            accent="call"
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <FAQ />
        </div>
      </section>
    </>
  );
}
