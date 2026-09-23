import { Armchair, BadgeIndianRupee, CarFront, Headset, Route, UserCheck } from "lucide-react";
import { Reveal } from "./Reveal";

const items = [
  {
    icon: CarFront,
    title: "Reliable Vehicles",
    text: "Well-maintained and comfortable vehicles for every journey.",
  },
  {
    icon: UserCheck,
    title: "Professional Drivers",
    text: "Experienced drivers who prioritize safety and comfort.",
  },
  {
    icon: BadgeIndianRupee,
    title: "Transparent Pricing",
    text: "No hidden surprises. Clear and understandable pricing.",
  },
  {
    icon: Headset,
    title: "24/7 Support",
    text: "Support whenever you need assistance during your journey.",
  },
  {
    icon: Route,
    title: "Flexible Travel",
    text: "One-way trips, round trips, daily rentals and customized travel plans.",
  },
  {
    icon: Armchair,
    title: "Comfort First",
    text: "From small cars to spacious group vehicles, travel comfortably every time.",
  },
];

export function WhyChooseUs() {
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <Reveal
          key={it.title}
          delay={i * 60}
          className="group rounded-3xl border border-border bg-card p-7 shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover"
        >
          <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-foreground transition-colors duration-500 group-hover:bg-gold group-hover:text-gold-foreground">
            <it.icon className="size-5" />
          </span>
          <h3 className="mt-6 text-lg font-semibold tracking-tight">{it.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.text}</p>
        </Reveal>
      ))}
    </div>
  );
}
