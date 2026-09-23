import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/site";

export function FAQ() {
  return (
    <Accordion
      type="single"
      collapsible
      className="mt-10 divide-y divide-border rounded-3xl border border-border bg-card px-5 sm:px-8"
    >
      {faqs.map((f, i) => (
        <AccordionItem key={f.q} value={`q-${i}`} className="border-b-0">
          <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline [&>svg]:text-gold">
            <span className="flex gap-4">
              <span className="text-muted-foreground tabular-nums">0{i + 1}</span>
              {f.q}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-6 pl-10 text-[15px] leading-relaxed text-muted-foreground">
            {f.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
