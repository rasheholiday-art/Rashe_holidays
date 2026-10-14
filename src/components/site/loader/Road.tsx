import { useEffect, useRef, useState } from "react";
import Car from "./Car";
import Hills from "./Hills";

const VIEW_WIDTH = 400;
const ROAD = "M2 10.5C70 9 130 11.5 200 10S330 9.2 398 10.8";
const ROAD_PENCIL = "M14 13.5C90 12.8 170 14.2 250 13.2S350 12.6 388 13.6";
const TICKS = [0, 25, 50, 75, 100];
const LABELS = [0, 100];

// Where the car's centre sits on the track at a given progress (CSS, for HTML labels).
const centreAt = (value: number) =>
  `calc((100% - var(--car-w)) * ${value} / 100 + var(--car-w) / 2)`;

interface RoadProps {
  progress: number;
  filterId: string;
}

export default function Road({ progress, filterId }: RoadProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ track: 0, car: 0 });

  useEffect(() => {
    const track = trackRef.current;
    const car = carRef.current;
    if (!track || !car) return;

    const measure = () => {
      setSize({ track: track.offsetWidth, car: car.offsetWidth });
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(car);
    return () => observer.disconnect();
  }, []);

  const { track, car } = size;
  const ready = track > 0 && car > 0;
  // Same position as centreAt, in road viewBox units (for SVG marks).
  const centreX = (value: number) =>
    track > 0 ? ((car / 2 + ((track - car) * value) / 100) / track) * VIEW_WIDTH : 0;

  return (
    <div ref={trackRef} className="relative [--car-w:104px] sm:[--car-w:124px]">
      <div className="relative h-20 sm:h-24">
        <Hills filterId={filterId} className="absolute inset-x-0 -bottom-2.5 w-full" />
        <div
          ref={carRef}
          className="absolute -bottom-2 z-10 w-[var(--car-w)]"
          style={{ left: `calc((100% - var(--car-w)) * ${progress} / 100)` }}
        >
          <Car
            travelledPx={track > 0 ? ((track - car) * progress) / 100 : 0}
            widthPx={car > 0 ? car : 104}
            moving={progress > 0 && progress < 100}
            filterId={filterId}
          />
        </div>
      </div>

      <svg
        viewBox="0 0 400 24"
        preserveAspectRatio="none"
        className="block h-6 w-full overflow-visible"
        fill="none"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <g filter={`url(#${filterId})`}>
          {ready && progress > 0 && (
            <line
              x1={centreX(0)}
              y1="11"
              x2={centreX(progress)}
              y2="10"
              strokeWidth="9"
              vectorEffect="non-scaling-stroke"
              opacity="0.8"
              className="stroke-highlight"
            />
          )}
          <path
            d={ROAD}
            strokeWidth="2.2"
            vectorEffect="non-scaling-stroke"
            className="stroke-ink"
          />
          <path
            d={ROAD_PENCIL}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            opacity="0.35"
            className="stroke-ink"
          />
          {ready && (
            <path
              d={TICKS.map((v) => `M${centreX(v)} 16v5`).join("")}
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
              className="stroke-ink"
            />
          )}
        </g>
      </svg>

      <div className="relative h-6 font-hand text-sm text-ink-muted">
        {LABELS.map((value) => (
          <span
            key={value}
            className="absolute top-0 -translate-x-1/2"
            style={{ left: centreAt(value) }}
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}
