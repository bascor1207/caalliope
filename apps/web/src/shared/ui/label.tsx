import type { ComponentProps } from "react";
import { cn } from "./cn";

/** Label enveloppant : le champ est passé en enfant, l'association est implicite. */
export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: le contrôle est toujours fourni en enfant par l'appelant.
    <label
      data-slot="label"
      className={cn("grid content-start gap-1.5 text-[13px] font-semibold", className)}
      {...props}
    />
  );
}
