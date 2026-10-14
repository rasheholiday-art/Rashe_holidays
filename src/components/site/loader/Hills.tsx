// Faint pencil sketch of the Nilgiris behind the road: ridges, pines, tea bushes, two birds.

interface HillsProps {
  className?: string;
  filterId: string;
}

const scallops = (x: number, y: number, count: number) => `M${x} ${y}${"q4-4 8 0".repeat(count)}`;
const pine = ([x, y]: [number, number]) =>
  `M${x} ${y - 14}l-3.5 6h2l-3.5 6h10l-3.5-6h2ZM${x} ${y - 2}v4`;

const PINES: [number, number][] = [
  [58, 38],
  [66, 36],
  [74, 38],
  [300, 31],
  [308, 30],
];

export default function Hills({ className, filterId }: HillsProps) {
  return (
    <svg
      viewBox="0 0 400 60"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <g filter={`url(#${filterId})`} strokeWidth="1.4" opacity="0.35" className="stroke-ink">
        <path d="M4 50C34 36 62 30 96 38S150 24 190 32 262 18 304 30 368 34 396 30" />
        <path d="M170 60C200 48 236 42 276 46S350 54 396 44" />
        <path d={scallops(232, 55, 12)} />
        <path d={scallops(252, 60, 14)} />
        <path d={PINES.map(pine).join("")} />
        <path d="M150 12q3-3 6 0q3-3 6 0M172 5q2.5-2.5 5 0q2.5-2.5 5 0" />
      </g>
    </svg>
  );
}
