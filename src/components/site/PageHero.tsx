import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import defaultHeroImg from "@/assets/hero-ooty.jpg";

interface Props {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  image?: string;
  children?: ReactNode;
  className?: string;
}

/** Dark inner-page hero with vibrant scenic background. */
export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  image,
  children,
  className,
}: Props) {
  const bgImage = image || defaultHeroImg;

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-ink pt-[72px] text-ink-foreground grain",
        className,
      )}
    >
      <img
        src={bgImage}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover object-[center_35%] opacity-80 sm:opacity-85 brightness-[1.02] contrast-[1.05]"
      />
      {/* Directional gradients so text on left is crisp and high-contrast, while landscape is vividly visible */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/35" />
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
