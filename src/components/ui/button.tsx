import * as React from "react";

import { clx } from "@/lib/utils/clx/clx-merge";
import { cn } from "@/lib/utils/core/cn";
import { cva, type VariantProps } from "@/lib/utils/core/cva";
import LoaderCircle from "@/components/icons/loader-circle";
import { Slot } from "@/components/primitives/core-slot";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50  w-fit dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90",
        destructive: "bg-red-500 text-gray-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-gray-50 dark:hover:bg-red-900/90",
        outline:
          "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
        ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
        link: "text-gray-900 underline-offset-4 hover:underline dark:text-gray-50",
        grey: "bg-gray-100/30 text-gray-900 shadow-sm hover:bg-gray-100/80 dark:bg-gray-800/30 dark:text-gray-50 dark:hover:bg-gray-800/80",

        // EXTENDED
        expandIcon:
          "group relative text-gray-50 bg-gray-900 hover:bg-gray-900/90 dark:text-gray-900 dark:bg-gray-50 dark:hover:bg-gray-50/90",
        ringHover:
          "bg-gray-900 text-gray-50 transition-all duration-300 hover:bg-gray-900/90 hover:ring-2 hover:ring-gray-900/90 hover:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:hover:ring-gray-50/90",
        shine:
          "text-gray-50 animate-shine bg-gradient-to-r from-primary via-primary/75 to-primary bg-[length:400%_100%]  dark:text-gray-900",
        gooeyRight:
          "text-gray-50 relative bg-gray-900 z-0 overflow-hidden transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r from-zinc-400 before:transition-transform before:duration-1000  hover:before:translate-x-[0%] hover:before:translate-y-[0%] dark:text-gray-900 dark:bg-gray-50",
        gooeyLeft:
          "text-gray-50 relative bg-gray-900 z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-400 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%] dark:text-gray-900 dark:bg-gray-50",
        linkHover1:
          "relative after:absolute after:bg-gray-900 after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300 dark:after:bg-gray-50",
        linkHover2:
          "relative after:absolute after:bg-gray-900 after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300 dark:after:bg-gray-50",
        // OTHERS
        heartbeatV0:
          "m-9 animate-heartbeatV0 rounded-md bg-red-500 px-4 py-1 font-semibold",
        textReveal:
          "group/button relative inline-flex size-7 items-center justify-center overflow-hidden rounded-full bg-neutral-500 font-medium transition-all duration-300 hover:w-24",
        shine2:
          "group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-neutral-500 px-4 py-1.5 font-normal transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-neutral-500/30",
        translate:
          "border hover:-translate-y-1 transform transition duration-200 hover:shadow-md",
        invert:
          "bg-neutral-500 transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-neutral-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        tiny: "p-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "size-8",
        xl: "h-16 rounded-md px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type IconProps = {
  Icon: React.ElementType;
  iconPlacement: "left" | "right";
};

type IconRefProps = {
  Icon?: never;
  iconPlacement?: undefined;
};

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

type ButtonIconProps = IconProps | IconRefProps;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoaderCircle className="mr-2 size-4 animate-spin" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export const ButtonGroup = clx(Button, "group relative overflow-hidden");
export const ButtonVisible = clx.div("transition");
export const ButtonHidden = clx.div("absolute transition");
export const ButtonText_R = clx.span("relative");

export { Button, buttonVariants };
export type { ButtonIconProps, ButtonProps, IconProps, IconRefProps };
