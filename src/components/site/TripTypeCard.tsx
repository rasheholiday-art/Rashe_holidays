import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, MoveRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  type: "one-way" | "round-trip";
  className?: string;
}

const content = {
  "one-way": {
    title: "One Way Trip",
    route: "Ooty → Mysore",
    icon: MoveRight,
    description:
      "A One Way Trip is perfect when your journey starts in one location and ends in another location.",
    example: [
      { k: "Pickup", v: "Ooty" },
      { k: "Destination", v: "Mysore" },
    ],
    note: "The journey ends at Mysore.",
    suitable: [
      "Airport drops",
      "City transfers",
      "One-direction travel",
      "Relocation travel",
      "Business trips",
    ],
  },
  "round-trip": {
    title: "Round Trip",
    route: "Ooty → Mysore → Ooty",
    icon: RefreshCw,
    description:
      "A Round Trip allows you to travel to your destination and return to your original pickup location.",
    example: [
      { k: "Day 1", v: "Ooty → Mysore" },
      { k: "Return", v: "Mysore → Ooty" },
    ],
    note: "The vehicle stays with you until you're home.",
    suitable: [
      "Family vacations",
      "Tourism",
      "Multi-day trips",
      "Business travel",
      "Sightseeing trips",
    ],
  },
};

export function TripTypeCard({ type, className }: Props) {
  const c = content[type];
  const Icon = c.icon;
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[2rem] border border-ink-border bg-ink-foreground/[0.04] p-7 text-ink-foreground transition-colors duration-500 hover:bg-ink-foreground/[0.07] sm:p-9",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-2xl bg-gold text-gold-foreground shadow-gold">
          <Icon className="size-5" />
        </span>
        <span className="rounded-full border border-ink-border px-3 py-1 text-xs font-semibold text-ink-muted">
          {c.route}
        </span>
      </div>
      <h3 className="mt-6 text-3xl font-semibold tracking-tight">{c.title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{c.description}</p>

      <RouteGraphic type={type} />

      <dl className="mt-2 grid grid-cols-2 gap-3">
        {c.example.map((e) => (
          <div key={e.k} className="rounded-2xl bg-ink-foreground/[0.06] px-4 py-3">
            <dt className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-muted">
              {e.k}
            </dt>
            <dd className="mt-1 text-base font-semibold">{e.v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs italic text-ink-muted">{c.note}</p>

      <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted">
        Suitable for
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {c.suitable.map((s) => (
          <li
            key={s}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-border px-3 py-1.5 text-xs font-medium"
          >
            <Check className="size-3 text-gold" strokeWidth={3} />
            {s}
          </li>
        ))}
      </ul>

      <Button asChild variant="gold" size="lg" className="mt-8 self-start">
        <Link to="/booking" search={{ tripType: type }}>
          Book a {c.title} <ArrowRight />
        </Link>
      </Button>
    </article>
  );
}

/** Animated route line: dashed path with a travelling vehicle. */
export function RouteGraphic({ type, light }: { type: "one-way" | "round-trip"; light?: boolean }) {
  const stroke = light ? "currentColor" : "oklch(0.977 0.006 85 / 0.35)";
  const isRound = type === "round-trip";
  const path = isRound
    ? "M20 40 C 90 0, 210 0, 280 40 C 210 80, 90 80, 20 40 Z"
    : "M20 40 C 100 10, 200 70, 280 40";
  const gradientId = `headlight-beam-${type}`;

  return (
    <div className="my-6 rounded-2xl bg-ink-foreground/[0.04] p-4" aria-hidden>
      <svg viewBox="0 0 300 80" className="h-24 w-full overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Road Path */}
        <path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeDasharray="6 6"
          className="animate-dash"
        />

        {/* Station Markers with Pulsing Radiance */}
        <circle cx="20" cy="40" r="11" fill="oklch(0.78 0.16 70 / 0.2)" className="animate-pulse" />
        <circle cx="20" cy="40" r="6" fill="oklch(0.78 0.16 70)" />

        <circle
          cx="280"
          cy="40"
          r="11"
          fill={isRound ? "oklch(0.78 0.16 70 / 0.2)" : "oklch(0.62 0.15 150 / 0.2)"}
          className="animate-pulse"
        />
        <circle
          cx="280"
          cy="40"
          r="6"
          fill={isRound ? "oklch(0.78 0.16 70)" : "oklch(0.62 0.15 150)"}
        />

        {/* Moving GPS Vehicle (Scaled 2x for high definition and clear car silhouette) */}
        <g>
          {isRound ? (
            <animateMotion path={path} dur="6.5s" repeatCount="indefinite" rotate="auto" />
          ) : (
            <>
              <animateMotion
                path={path}
                dur="4.6s"
                repeatCount="indefinite"
                rotate="auto"
                keyPoints="0; 1; 1"
                keyTimes="0; 0.78; 1"
                calcMode="linear"
              />
              <animate
                attributeName="opacity"
                values="0; 1; 1; 0; 0"
                keyTimes="0; 0.08; 0.78; 0.90; 1"
                dur="4.6s"
                repeatCount="indefinite"
              />
            </>
          )}

          {/* Scaled-up car body and accessories (2x) */}
          <g transform="scale(2)">
            {/* Headlight beam cone */}
            <polygon points="8,-3.5 28,-9 28,9 8,3.5" fill={`url(#${gradientId})`} />

            {/* Underbody Shadow */}
            <rect x="-9.5" y="-5.5" width="19" height="11" rx="3.5" fill="#000000" opacity="0.45" />

            {/* 4 Tires */}
            <rect x="3.5" y="-6.2" width="4" height="1.6" rx="0.8" fill="#18181b" />
            <rect x="3.5" y="4.6" width="4" height="1.6" rx="0.8" fill="#18181b" />
            <rect x="-7.5" y="-6.2" width="4" height="1.6" rx="0.8" fill="#18181b" />
            <rect x="-7.5" y="4.6" width="4" height="1.6" rx="0.8" fill="#18181b" />

            {/* Main Car Body (Theme Gold Cab) */}
            <rect
              x="-9"
              y="-5"
              width="18"
              height="10"
              rx="3"
              fill="oklch(0.78 0.16 70)"
              stroke="#1c1c1f"
              strokeWidth="0.6"
            />

            {/* Front Windshield */}
            <path d="M 2 -3.8 L 4.5 -2.5 L 4.5 2.5 L 2 3.8 Z" fill="#18181b" />

            {/* Cabin Roof */}
            <rect x="-5" y="-3.6" width="7" height="7.2" rx="1.5" fill="#292524" />

            {/* Taxi Roof Sign */}
            <rect x="-2" y="-1.2" width="3" height="2.4" rx="0.6" fill="#f59e0b" />

            {/* Rear Windshield */}
            <path d="M -5 -3.6 L -6.5 -2.5 L -6.5 2.5 L -5 3.6 Z" fill="#18181b" />

            {/* Side Mirrors */}
            <rect x="1.5" y="-6.2" width="1.8" height="1.4" rx="0.5" fill="oklch(0.78 0.16 70)" />
            <rect x="1.5" y="4.8" width="1.8" height="1.4" rx="0.5" fill="oklch(0.78 0.16 70)" />

            {/* Headlights (bright glow at front bumper) */}
            <circle cx="8.5" cy="-3.5" r="1.1" fill="#fffbeb" />
            <circle cx="8.5" cy="3.5" r="1.1" fill="#fffbeb" />

            {/* Tail lights */}
            <rect x="-9.2" y="-4.2" width="0.8" height="1.5" rx="0.4" fill="#ef4444" />
            <rect x="-9.2" y="2.7" width="0.8" height="1.5" rx="0.4" fill="#ef4444" />
          </g>
        </g>

        {/* Station Labels */}
        <text
          x="20"
          y="68"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="currentColor"
          opacity="0.85"
        >
          Ooty
        </text>
        <text
          x="280"
          y="68"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="currentColor"
          opacity="0.85"
        >
          Mysore
        </text>
        {isRound && (
          <text x="150" y="14" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55">
            outbound
          </text>
        )}
        {isRound && (
          <text x="150" y="76" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55">
            return
          </text>
        )}
      </svg>
    </div>
  );
}
