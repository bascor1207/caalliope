"use client";

import { clx } from "@/lib/utils/clx/clx-merge";
import { cn } from "@/lib/utils/core/cn";
// Primitives are CLI-installed by default, but @radix-ui can also be used
import * as PopoverPrimitive from "@/components/primitives/popover";
import { MOTION } from "@/components/ui/_shared";
import React from "react";

// TODO UI

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverTitle = clx.h4("font-medium leading-none");
export const PopoverDescription = clx.p("text-sm text-gray-500 dark:text-gray-400");

export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        MOTION.ANIMATE_IN,
        MOTION.ANIMATE_OUT,
        MOTION.FADE_IN_OUT,
        MOTION.ZOOM_IN_OUT,
        MOTION.SLIDE_IN,
        "z-50 w-72 rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-md outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
