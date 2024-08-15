import { clx } from "@/lib/utils/clx/clx-merge";
import type { ComponentProps, VariantProps } from "@/lib/utils/clx/types";
import { STYLES } from "@/components/ui/_shared";

export const Badge = clx.div(
  STYLES.RING_FOCUS,
  STYLES.FLEX_CENTER,
  "rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors w-fit dark:border-gray-800",
  "leading-none",
  "rounded-md",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/80",
        secondary:
          "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
        destructive:
          "border-transparent bg-red-500 text-gray-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-gray-50 dark:hover:bg-red-900/80",
        outline: "text-gray-950 dark:text-gray-50",
        isNew: "bg-neutral-500  px-1.5 text-[#000000]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeVariants = VariantProps<typeof Badge>;
export type BadgeProps = ComponentProps<typeof Badge>;
