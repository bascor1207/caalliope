"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui";

export function FaqAccordion({ items }: { items: Array<{ q: string; a: string }> }) {
  return (
    <Accordion type="single" collapsible>
      {items.map((item, i) => (
        <AccordionItem key={item.q} value={`faq-${i}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
