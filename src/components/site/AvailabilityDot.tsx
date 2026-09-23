import { cn } from "@/lib/utils";

export function AvailabilityDot({
  available,
  onDark,
  className,
}: {
  available: boolean;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold backdrop-blur",
        onDark
          ? "bg-ink/60 text-ink-foreground"
          : available
            ? "bg-success-soft text-success"
            : "bg-secondary text-muted-foreground",
        className,
      )}
    >
      <span className="relative flex size-2">
        {available && (
          <span className="absolute inline-flex size-full rounded-full bg-success animate-pulse-soft" />
        )}
        <span
          className={cn(
            "relative inline-flex size-2 rounded-full",
            available ? "bg-success" : "bg-muted-foreground",
          )}
        />
      </span>
      {available ? "Available now" : "Booked · enquire"}
    </span>
  );
}
