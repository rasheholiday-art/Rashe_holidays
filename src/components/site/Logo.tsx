import { cn } from "@/lib/utils";
import { company } from "@/data/site";
import logoBadge from "@/assets/logo-badge.png";

export function Logo({ light, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid size-10 place-items-center rounded-full overflow-hidden shrink-0 shadow-sm bg-white ring-1 ring-border/20">
        <img
          src={logoBadge}
          alt={`${company.name} Logo`}
          className="size-full object-contain"
        />
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
