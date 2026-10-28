import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories, vehiclesByCategory, type CategoryId } from "@/data/site";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { AvailabilityDot } from "./AvailabilityDot";
import { Stars } from "./Stars";

const order: CategoryId[] = ["7-seater", "4-seater", "9-seater", "12-seater", "16-seater"];

/** Large editorial category cards for the home page. */
export function CategoryShowcase() {
  return (
    <div className="mt-14 space-y-8 lg:space-y-10">
      {order.map((id, i) => {
        const cat = categories.find((c) => c.id === id)!;
        const list = vehiclesByCategory(id);
        const hero = list[0]!;
        const hasMultiple = list.length > 1;
        const flip = i % 2 === 1;
        return (
          <Reveal key={id}>
            <article className="group grid overflow-hidden rounded-[2rem] border border-border bg-card shadow-card transition-shadow duration-500 hover:shadow-card-hover lg:grid-cols-2">
              {/* Visual */}
              <div className={cn("relative min-h-[320px] lg:min-h-[520px]", flip && "lg:order-2")}>
                {hasMultiple ? (
                  <div className="grid h-full grid-cols-2 gap-1 bg-border">
                    {list.map((v) => (
                      <Link
                        key={v.slug}
                        to="/vehicles/$slug"
                        params={{ slug: v.slug }}
                        className="img-zoom relative bg-muted flex items-center justify-center p-4"
                      >
                        <img
                          src={v.images[0]}
                          alt={v.name}
                          loading="lazy"
                          className="size-full object-contain"
                        />
                        <span className="absolute bottom-3 left-3 rounded-full bg-shade/75 px-2.5 py-1 text-[11px] font-bold text-ink-foreground backdrop-blur">
                          {v.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="img-zoom absolute inset-0 flex items-center justify-center p-6 bg-card/60">
                    <img
                      src={hero.images[0]}
                      alt={hero.name}
                      loading="lazy"
                      className="size-full object-contain"
                    />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-5">
                  <span className="rounded-full bg-shade/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-foreground backdrop-blur">
                    {cat.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-bold backdrop-blur">
                    <Users className="size-3.5 text-gold" /> {cat.seats} Seats
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className={cn("flex flex-col p-7 sm:p-10 lg:p-12", flip && "lg:order-1")}>
                <div className="flex items-center gap-3">
                  <AvailabilityDot available />
                  <span className="text-xs text-muted-foreground">
                    <Stars rating={hero.rating} size="size-3" className="mr-1 align-middle" />
                    {hero.rating} ({hero.reviews})
                  </span>
                  {hasMultiple && (
                    <span className="text-xs text-muted-foreground">
                      · {list.length} models available
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-3xl sm:text-4xl font-semibold tracking-tight">
                  {cat.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {cat.blurb}
                </p>

                <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
                  {hero.features.slice(0, 6).map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full bg-gold-soft text-gold">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>


                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild variant="outline" size="lg">
                    {hasMultiple ? (
                      <Link to="/vehicles" search={{ category: id }}>
                        View Models <ArrowRight />
                      </Link>
                    ) : (
                      <Link to="/vehicles/$slug" params={{ slug: hero.slug }}>
                        View Vehicle <ArrowRight />
                      </Link>
                    )}
                  </Button>
                  <Button asChild variant="gold" size="lg">
                    <Link to="/booking" search={{ category: id }}>
                      Book Now
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
