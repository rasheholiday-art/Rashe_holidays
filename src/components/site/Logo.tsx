import { cn } from "@/lib/utils";
import { company } from "@/data/site";

export function Logo({ light, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid size-9 place-items-center rounded-xl bg-gold text-gold-foreground shadow-gold">
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 17l4-9 5 6 4-4 5 7" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[17px] font-extrabold tracking-tight",
            light ? "text-ink-foreground" : "text-foreground",
          )}
        >
          {company.name}
        </span>
        <span
          className={cn(
            "mt-0.5 text-[9.5px] font-semibold uppercase tracking-[0.2em]",
            light ? "text-ink-foreground/60" : "text-muted-foreground",
          )}
        >
          Ooty · Travels
        </span>
      </span>
    </span>
  );
}
