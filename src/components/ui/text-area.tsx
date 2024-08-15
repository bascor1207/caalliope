import { clx } from "@/lib/utils/clx/clx-merge";
import { STYLES } from "@/components/ui/_shared";

export const TextArea = clx.textarea(
  STYLES.DISABLED_NOT_ALLOWED,
  STYLES.BORDER_INPUT,
  STYLES.OFFSET_BG,
  STYLES.RING_FOCUS_VISIBLE,
  "flex  w-full rounded-md bg-white px-3 py-2 dark:bg-gray-950",
  "focus-visible:outline-none",
  "text-sm  placeholder:text-gray-500 dark:placeholder:text-gray-400",
);
