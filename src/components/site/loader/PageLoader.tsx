import { useId } from "react";
import Road from "./Road";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import headerLogo from "@/assets/header-logo.png";
import { company } from "@/data/site";

// One note per quarter of the drive.
const STAGES = [
  { from: 0, label: "starting the engine…" },
  { from: 25, label: "climbing the ghat road…" },
  { from: 50, label: "past the tea gardens…" },
  { from: 75, label: "almost in Ooty…" },
  { from: 100, label: "welcome to the Nilgiris!" },
];

// Shared "boiling line" wobble, so the drawing feels hand-animated rather than vector-perfect.
function WobbleFilter({ id, animate }: { id: string; animate: boolean }) {
  return (
    <svg className="absolute size-0" aria-hidden="true">
      <filter id={id} x="-10%" y="-50%" width="120%" height="200%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.04"
          numOctaves={2}
          seed="2"
          result="noise"
        >
          {animate && (
            <animate
              attributeName="seed"
              values="2;5;9"
              dur="0.42s"
              calcMode="discrete"
              repeatCount="indefinite"
            />
          )}
        </feTurbulence>
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="3"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}

export interface PageLoaderProps {
  progress: number;
  visible?: boolean;
  onDismiss?: () => void;
}

/**
 * Centred page loader that covers the site while it loads.
 * @param progress number from 0 to 100
 * @param visible  set to false to fade the loader out and reveal the site
 * @param onDismiss optional callback when clicked to dismiss
 */
export default function PageLoader({ progress, visible = true, onDismiss }: PageLoaderProps) {
  const filterId = useId();
  const reduceMotion = usePrefersReducedMotion();
  const value = Math.min(Math.max(progress, 0), 100);
  const percent = Math.floor(value);
  const stage = [...STAGES].reverse().find((s) => percent >= s.from) ?? STAGES[0];

  return (
    <div
      onClick={onDismiss}
      className={`paper-loader paper-grain fixed inset-0 z-[9999] grid place-items-center bg-paper px-4 text-ink transition-opacity duration-500 select-none ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      {...(!visible ? { inert: "" } : {})}
    >
      <WobbleFilter id={filterId} animate={!reduceMotion} />

      <div className="w-full max-w-[22rem] sm:max-w-[26rem]">
        <div className="flex justify-center pb-2">
          <img
            src={headerLogo}
            alt={company.name}
            className="h-11 sm:h-14 w-auto object-contain"
          />
        </div>

        <div
          className="mt-4"
          role="progressbar"
          aria-label="Loading Rashe Holidays"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <Road progress={value} filterId={filterId} />
        </div>

        <p
          className="mt-3 text-center font-hand text-5xl leading-none font-bold text-ink"
          aria-hidden="true"
        >
          <span className="inline-block w-[3ch] text-right">{percent}</span>
          <span className="text-3xl text-ink-muted">%</span>
        </p>
        <p className="mt-2 text-center font-hand text-lg text-ink-muted" aria-live="polite">
          {stage.label}
        </p>
      </div>
    </div>
  );
}
