import { cn } from "@/lib/utils/core/cn";
import { STYLES } from "@/components/ui/_shared";
import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          STYLES.OFFSET_BG,
          STYLES.RING_FOCUS_VISIBLE,
          STYLES.BORDER_INPUT,
          STYLES.DISABLED_NOT_ALLOWED,
          STYLES.TEXT_MUTED_PLACEHOLDER,
          "focus-visible:outline-none",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "flex h-10 w-full",
          "rounded-md bg-white px-3 py-2 text-sm dark:bg-gray-950",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
