import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  image?: string;
  children?: ReactNode;
  className?: string;
}

/** Dark inner-page hero. */
export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  image,
  children,
  className,
}: Props) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-ink pt-[72px] text-ink-foreground grain",
        className,
      )}
    >
      {image && (
        <>
          <img src={image} alt="" className="absolute inset-0 size-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
        </>
      )}
      <div className="container-x relative py-16 sm:py-20 lg:py-24">
        <span className="eyebrow animate-fade-up">{eyebrow}</span>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.02] sm:text-5xl lg:text-6xl animate-fade-up [animation-delay:80ms]">
          {title} {accent && <span className="display italic text-gold">{accent}</span>}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg animate-fade-up [animation-delay:160ms]">
            {description}
          </p>
        )}
        {children && <div className="mt-8 animate-fade-up [animation-delay:240ms]">{children}</div>}
      </div>
    </section>
  );
}
