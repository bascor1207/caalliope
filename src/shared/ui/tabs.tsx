"use client";

import { Tabs as TabsPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "./cn";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cn("flex flex-wrap gap-2", className)} {...props} />;
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-[1.5px] border-line px-4 py-2.5 font-display text-[13px] font-bold transition-all hover:border-ink data-[state=active]:border-ink data-[state=active]:bg-ink data-[state=active]:text-cream [&>span]:font-sans [&>span]:text-xs [&>span]:font-medium [&>span]:text-muted data-[state=active]:[&>span]:text-cream/60",
        className,
      )}
      {...props}
    />
  );
}

export const TabsContent = TabsPrimitive.Content;
