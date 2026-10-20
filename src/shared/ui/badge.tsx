import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "./cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em]",
  {
    variants: {
      variant: {
        light: "bg-white/85 text-ink backdrop-blur-[6px]",
        dark: "bg-ink text-cream",
      },
    },
    defaultVariants: { variant: "light" },
  },
);

export function Badge({ className, variant, ...props }: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
