import { Link, useRouterState } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/data/site";

/** Mobile-only sticky bar with Book Now + call. Hidden on the booking page itself. */
export function StickyBookBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/booking")) return null;
  return (
    <div className="min-[900px]:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
      <div className="flex gap-3">
        <Button asChild variant="outline" size="lg" className="shrink-0 px-4">
          <a href={company.phoneHref} aria-label="Call us">
            <Phone />
          </a>
        </Button>
        <Button asChild variant="gold" size="lg" className="flex-1">
          <Link to="/booking">Book Now</Link>
        </Button>
      </div>
    </div>
  );
}
