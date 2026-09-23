import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { company, whatsappUrl } from "@/data/site";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "./WhatsAppButton";

export function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="container-x">
        {/* CTA band */}
        <div className="relative -translate-y-14 rounded-3xl bg-gold px-6 py-10 sm:px-12 sm:py-12 text-gold-foreground shadow-float overflow-hidden">
          <div
            className="absolute -right-16 -top-16 size-64 rounded-full bg-ink-foreground/25 blur-2xl"
            aria-hidden
          />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">
                Talk to a human
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
                Need Help Planning Your Trip?
              </h2>
              <p className="mt-2 max-w-lg text-[15px] opacity-80">
                Our travel experts know every ghat road, viewpoint and shortcut in the Nilgiris. Get
                a custom itinerary and exact quote in minutes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="ink" size="xl">
                <a href={whatsappUrl("Hi! I need help planning my trip.")}>
                  <WhatsAppIcon className="size-6" /> Talk to Our Travel Expert
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="xl"
                className="bg-transparent border-gold-foreground/30 text-gold-foreground hover:bg-gold-foreground/10 hover:border-gold-foreground/60"
              >
                <a href={company.phoneHref}>
                  <Phone /> {company.phone}
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-12 pb-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-muted">
              Premium travels and transportation from Ooty, Tamil Nadu. One-way trips, round trips
              and day rentals across South India with a fleet you can trust.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-ink-muted">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-success animate-pulse-soft" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              Dispatch desk online · {company.hours}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/vehicles" className="hover:text-gold transition-colors">
                  Our Vehicles
                </Link>
              </li>
              <li>
                <Link to="/trip-types" className="hover:text-gold transition-colors">
                  Trip Types
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-gold transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-gold transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">Fleet</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  to="/vehicles/$slug"
                  params={{ slug: "toyota-innova-hycross" }}
                  className="hover:text-gold transition-colors"
                >
                  Toyota Innova HyCross
                </Link>
              </li>
              <li>
                <Link
                  to="/vehicles/$slug"
                  params={{ slug: "19-seater-traveller" }}
                  className="hover:text-gold transition-colors"
                >
                  19 Seater Traveller
                </Link>
              </li>
              <li>
                <Link
                  to="/vehicles"
                  search={{ category: "4-seater" }}
                  className="hover:text-gold transition-colors"
                >
                  4-Seater Cars
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-gold transition-colors">
                  Book a Ride
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <Phone className="size-4 shrink-0 text-gold" />
                <a href={company.phoneHref}>{company.phone}</a>
              </li>
              <li className="flex gap-3">
                <Mail className="size-4 shrink-0 text-gold" />
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>
              <li className="flex gap-3">
                <MapPin className="size-4 shrink-0 text-gold" />
                <span className="text-ink-muted">{company.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-ink-border py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p>
            Vehicle photographs are real, courtesy of Wikimedia Commons contributors (CC BY-SA).
          </p>
        </div>
      </div>
    </footer>
  );
}
