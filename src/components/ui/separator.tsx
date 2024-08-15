"use client";

import * as React from "react";

import { cn } from "@/lib/utils/core/cn";
// Primitives are CLI-installed by default, but @radix-ui can also be used
import * as SeparatorPrimitive from "@/components/primitives/separator";

// TODO UI

// const SeparatorRoot = clx(SeparatorPrimitive.Root, "shrink-0 bg-border");

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-gray-200 dark:bg-gray-800",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className,
    )}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
