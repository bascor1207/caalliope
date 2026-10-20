import type { ComponentProps } from "react";
import { cn } from "./cn";

export function Input({ className, type = "text", "aria-invalid": invalid, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      aria-invalid={invalid}
      className={cn(
        "w-full rounded-[10px] border-[1.5px] border-line bg-white px-3.5 py-3 text-base outline-none transition-colors placeholder:text-muted/70 focus:border-ink aria-invalid:border-danger",
        className,
      )}
      {...props}
    />
  );
}
