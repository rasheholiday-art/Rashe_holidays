import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { company } from "@/data/site";
import headerLogo from "@/assets/header-logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/vehicles", label: "Vehicles" },
  { to: "/trip-types", label: "Trip Types" },
  { to: "/destinations", label: "Destinations" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          "bg-background/95 backdrop-blur-xl border-b border-border/70 shadow-sm",
        )}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-4">
          <Link to="/" aria-label={`${company.name} home`} className="shrink-0 flex items-center">
            <img
              src={headerLogo}
              alt={company.name}
              className="h-10 sm:h-11 w-auto object-contain transition-all duration-300"
            />
          </Link>

          <nav className="hidden min-[900px]:flex items-center gap-0.5" aria-label="Main">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="relative px-3.5 py-2 text-[13.5px] font-medium rounded-full transition-colors text-muted-foreground hover:text-foreground"
                activeProps={{
                  className: "!font-semibold !text-foreground",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={company.phoneHref}
              className="hidden xl:inline-flex items-center gap-2 text-[13.5px] font-medium mr-2 text-foreground hover:text-gold transition-colors"
            >
              <Phone className="size-4 text-gold" /> {company.phone}
            </a>
            <Button asChild variant="gold" className="hidden sm:inline-flex">
              <Link to="/booking">Book Your Ride</Link>
            </Button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="min-[900px]:hidden inline-flex size-11 items-center justify-center rounded-full border transition-colors border-border text-foreground bg-card hover:bg-muted"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "min-[900px]:hidden fixed inset-x-0 top-[72px] bottom-0 z-[60] bg-background transition-all duration-300 ease-out overflow-y-auto",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none",
        )}
      >
        <nav className="container-x flex flex-col py-6" aria-label="Mobile">
          {links.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="flex items-center justify-between border-b border-border py-4 text-2xl font-semibold tracking-tight"
              activeProps={{ className: "text-gold" }}
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {l.label}
              <span className="text-muted-foreground text-sm font-normal">0{i + 1}</span>
            </Link>
          ))}
          <div className="mt-8 grid gap-3">
            <Button asChild variant="gold" size="xl">
              <Link to="/booking">Book Your Ride</Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <a href={company.phoneHref}>
                <Phone /> Call {company.phone}
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
