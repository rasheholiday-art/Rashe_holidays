import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface Props {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "left",
  dark,
  className,
}: Props) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <span className={cn("eyebrow", align === "center" && "justify-center")}>{eyebrow}</span>
      )}
      <h2
        className={cn(
          "mt-4 text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold leading-[1.05]",
          dark ? "text-ink-foreground" : "text-foreground",
        )}
      >
        {title} {accent && <span className="display italic text-gold">{accent}</span>}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-base sm:text-lg leading-relaxed",
            dark ? "text-ink-muted" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
