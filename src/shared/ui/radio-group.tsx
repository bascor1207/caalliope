"use client";

import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "./cn";

export function RadioGroup({ className, ...props }: ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2 sm:grid-cols-3", className)} {...props} />;
}

/** Option "carte" : toute la tuile est cliquable, l'état coché se lit sur la bordure. */
export function RadioCard({ className, children, ...props }: ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "flex items-center gap-2.5 rounded-[10px] border-[1.5px] border-line px-3.5 py-3 text-left text-[13px] font-semibold transition-colors data-[state=checked]:border-ink data-[state=checked]:bg-white",
        className,
      )}
      {...props}
    >
      <span className="grid size-4 place-items-center rounded-full border-[1.5px] border-ink">
        <RadioGroupPrimitive.Indicator className="size-2 rounded-full bg-ink" />
      </span>
      {children}
    </RadioGroupPrimitive.Item>
  );
}
