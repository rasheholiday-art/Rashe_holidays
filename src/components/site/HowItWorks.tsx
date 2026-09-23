import { CarFront, CheckCircle2, MapPinned, Route } from "lucide-react";
import { Reveal } from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Choose Your Vehicle",
    text: "Select from our 4-seater cars, premium 8-seater Innova HyCross or spacious 19-seater Traveller.",
    icon: CarFront,
  },
  {
    n: "02",
    title: "Select Your Trip Type",
    text: "Choose between One Way or Round Trip depending on your travel requirements.",
    icon: Route,
  },
  {
    n: "03",
    title: "Enter Journey Details",
    text: "Provide your pickup location, destination, travel dates and passenger information.",
    icon: MapPinned,
  },
  {
    n: "04",
    title: "Confirm Your Booking",
    text: "Submit your request and our travel team will contact you to confirm availability and final pricing.",
    icon: CheckCircle2,
  },
];

export function HowItWorks() {
  return (
    <ol className="relative mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {/* connecting line */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px lg:block"
        aria-hidden
      >
        <svg className="h-px w-full overflow-visible">
          <line
            x1="12%"
            x2="88%"
            y1="0.5"
            y2="0.5"
            stroke="oklch(0.78 0.16 70)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            className="animate-dash"
          />
        </svg>
      </div>
      {steps.map((s, i) => (
        <Reveal as="li" key={s.n} delay={i * 100} className="relative">
          <div className="relative z-10 grid size-16 place-items-center rounded-2xl border border-border bg-card shadow-card">
            <s.icon className="size-6 text-gold" />
            <span className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full bg-ink text-[11px] font-bold text-ink-foreground">
              {s.n}
            </span>
          </div>
          <h3 className="mt-6 text-xl font-semibold tracking-tight">{s.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}
