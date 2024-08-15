"use client";
import * as React from "react";

import { cn } from "@/lib/utils/core/cn";
// Primitives are CLI-installed by default, but @radix-ui can also be used
import Check from "@/components/icons/check";
import * as CheckboxPrimitive from "@/components/primitives/checkbox";
import { STYLES } from "@/components/ui/_shared";

// TODO UI

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      STYLES.DATA_STATE_CHECKED,
      //
      STYLES.OFFSET_BG,
      STYLES.DISABLED_NOT_ALLOWED,
      STYLES.RING_FOCUS_VISIBLE,
      "focus-visible:outline-none",
      "peer size-4 shrink-0 rounded-sm border border-gray-200 border-gray-900 dark:border-gray-800 dark:border-gray-50",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(STYLES.FLEX_CENTER_JUSTIFIED, "text-current")}
    >
      <Check className="size-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
