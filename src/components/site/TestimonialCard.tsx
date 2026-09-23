import { Quote } from "lucide-react";
import { Stars } from "./Stars";

interface T {
  name: string;
  location: string;
  rating: number;
  text: string;
  initials: string;
}

export function TestimonialCard({ t }: { t: T }) {
  return (
    <figure className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-card sm:p-7">
      <Quote className="size-6 text-gold" />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground">
        “{t.text}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-ink-foreground">
          {t.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.location}</p>
        </div>
        <Stars rating={t.rating} size="size-3.5" className="ml-auto" />
      </figcaption>
    </figure>
  );
}
