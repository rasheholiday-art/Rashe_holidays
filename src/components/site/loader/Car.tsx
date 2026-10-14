import { useId } from "react";

// A hand-drawn green MPV with a suitcase on the roof, facing right.
// The green is printed slightly off-register from the ink outline, like a riso print.

const VIEW_WIDTH = 194;
const WHEEL_RADIUS = 13;

const BODY =
  "M15 64C11 64 9 61 9 57L10 42C10 36 14 33 19 32L26 16C28 12 31 11 36 11H104C110 11 114 13 118 17L134 33L151 37C159 39 163 44 163 50V57C163 61 160 64 156 64H144A16 16 0 0 0 112 64H58A16 16 0 0 0 26 64Z";
const GLASS_REAR = "M32 16H61V30H27Z";
const GLASS_FRONT = "M68 16H110C112 16 113 17 114 18L126 30H68Z";
const HATCHING = [12, 18, 64, 71, 78, 85, 92, 99, 106, 148, 154]
  .map((x) => `M${x} 61l5-7`)
  .join("");

interface WheelProps {
  cx: number;
  angle: number;
}

function Wheel({ cx, angle }: WheelProps) {
  return (
    <g transform={`translate(${cx} 67)`}>
      <circle r={WHEEL_RADIUS} className="fill-ink" />
      <circle r="6" strokeWidth="1.6" className="fill-paper stroke-ink" />
      <path
        d="M-4 0H4"
        transform={`rotate(${angle})`}
        strokeWidth="1.8"
        strokeLinecap="round"
        className="stroke-ink"
      />
    </g>
  );
}

export interface CarProps {
  travelledPx: number;
  widthPx: number;
  moving: boolean;
  filterId: string;
}

export default function Car({ travelledPx, widthPx, moving, filterId }: CarProps) {
  const clipId = useId();
  const wheelRadiusPx = (WHEEL_RADIUS * widthPx) / VIEW_WIDTH;
  const angle = wheelRadiusPx > 0 ? (travelledPx / wheelRadiusPx) * (180 / Math.PI) : 0;

  return (
    <svg
      viewBox="-24 -16 194 100"
      className="block h-auto w-full overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={BODY} />
        </clipPath>
      </defs>

      <g filter={`url(#${filterId})`}>
        <g className={moving ? "motion-safe:animate-car-bob" : undefined}>
          {/* Colour layer, nudged off the line work */}
          <g transform="translate(-2.5 2)">
            <rect x="50" y="-7" width="36" height="14" rx="3" className="fill-suitcase" />
            <path d={BODY} className="fill-leaf" />
            <path d={GLASS_REAR} className="fill-paper" />
            <path d={GLASS_FRONT} className="fill-paper" />
          </g>

          {/* Ink layer */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round" className="stroke-ink">
            <path d="M36 7H104M42 7v4M98 7v4" strokeWidth="1.8" />
            <rect x="50" y="-7" width="36" height="14" rx="3" strokeWidth="2" />
            <path d="M63-7v-3.5h10V-7M58-7V7M78-7V7" strokeWidth="1.5" />

            <path d={BODY} strokeWidth="2.2" />
            <path d={GLASS_REAR} strokeWidth="1.8" />
            <path d={GLASS_FRONT} strokeWidth="1.8" />
            <path d="M65 33v28M96 33v28M73 38h7M104 38h7M150 60h10" strokeWidth="1.6" />
            <path d={HATCHING} clipPath={`url(#${clipId})`} strokeWidth="1.2" opacity="0.45" />

            <circle cx="157" cy="45" r="2.6" strokeWidth="1.4" className="fill-headlight" />
            <rect
              x="9.5"
              y="40"
              width="3.5"
              height="8"
              rx="1"
              strokeWidth="1.2"
              className="fill-taillight"
            />
          </g>
        </g>

        <Wheel cx={42} angle={angle} />
        <Wheel cx={128} angle={angle} />

        {moving && (
          <path
            d="M-6 26H-20M-2 40H-22M-8 54H-17"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.6"
            className="stroke-ink motion-reduce:hidden"
          />
        )}
      </g>
    </svg>
  );
}
