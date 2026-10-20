import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "./cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 rounded-full font-display font-bold tracking-[0.02em] whitespace-nowrap transition-[transform,background-color,color,box-shadow] duration-300 ease-expo active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-cream shadow-[0_10px_30px_-12px_rgba(20,20,20,.5)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-14px_rgba(20,20,20,.55)]",
        ghost: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-cream",
        soft: "bg-ink/6 text-ink hover:bg-ink/10",
        icon: "size-[42px] rounded-full hover:bg-ink/6",
        link: "underline underline-offset-[3px] rounded-none px-0 h-auto font-sans font-medium",
      },
      size: {
        md: "h-12 px-6 text-sm",
        sm: "h-10 px-4 text-[13px]",
        icon: "size-[42px] p-0",
        none: "",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  const resolvedSize = size ?? (variant === "icon" ? "icon" : variant === "link" ? "none" : undefined);
  return (
    <Comp data-slot="button" className={cn(buttonVariants({ variant, size: resolvedSize, className }))} {...props} />
  );
}
