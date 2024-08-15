"use client";

import type { PropsWithChildren } from "react";

import { clx } from "@/lib/utils/clx/clx-merge";
// Primitives are CLI-installed by default, but @radix-ui can also be used
import ChevronDown from "@/components/icons/chevron-down";
import * as AccordionPrimitive from "@/components/primitives/accordion";
import { MOTION, STYLES } from "@/components/ui/_shared";

export const Accordion = AccordionPrimitive.Root;
export const AccordionHeader = clx(AccordionPrimitive.Header, "flex");
export const AccordionItem = clx(AccordionPrimitive.Item, "border-b");

export const AccordionContent = clx(
  AccordionPrimitive.Content,
  MOTION.ANIMATE_ACCORDION,
  "overflow-hidden text-sm transition-all mb-4",
);

export const TriggerWrapper = clx(
  AccordionPrimitive.Trigger,
  STYLES.FLEX_BETWEEN,
  "flex-1 py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
);

export function AccordionTrigger({ children }: PropsWithChildren) {
  return (
    <AccordionHeader>
      <TriggerWrapper>
        {children}
        <ChevronDown className="transition-transform duration-200 shrink-0 size-4" />
      </TriggerWrapper>
    </AccordionHeader>
  );
}
