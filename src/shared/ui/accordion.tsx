"use client";

import { PlusIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "./cn";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("border-b border-line", className)} {...props} />;
}

export function AccordionTrigger({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-center justify-between gap-5 py-[22px] text-left font-display text-[19px] font-bold tracking-[-0.01em] leading-tight",
          className,
        )}
        {...props}
      >
        {children}
        <span className="grid size-7 shrink-0 place-items-center rounded-full border-[1.5px] border-ink transition-[transform,background-color,color] duration-300 ease-expo group-data-[state=open]:rotate-45 group-data-[state=open]:bg-ink group-data-[state=open]:text-cream">
          <PlusIcon className="size-4" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
      {...props}
    >
      <div className={cn("max-w-[680px] pb-[22px] text-ink-2", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
