"use client";

import { clx } from "@/lib/utils/clx/clx-merge";
import Circle from "@/components/icons/circle";
// Primitives are CLI-installed by default, but @radix-ui can also be used
import * as RadioGroupPrimitive from "@/components/primitives/radio-group";
import { STYLES } from "@/components/ui/_shared";

const RadioGroupRoot = clx(RadioGroupPrimitive.Root, "grid gap-2");

const RadioGroupItemRoot = clx(
  RadioGroupPrimitive.Item,
  STYLES.DISABLED_NOT_ALLOWED,
  STYLES.RING_FOCUS_VISIBLE,
  STYLES.OFFSET_BG,
  "focus:outline-none",
  "aspect-square size-4 rounded-full border border-gray-200 border-gray-900 text-gray-900 dark:border-gray-800 dark:border-gray-50 dark:text-gray-50",
);

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                     ✨ FUNCTIONS ✨                        */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

export function RadioGroup({
  ...props
}: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupRoot {...props} />;
}

export function RadioGroupItem({
  ...props
}: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupItemRoot {...props}>
      <RadioGroupPrimitive.Indicator className={STYLES.FLEX_CENTER_JUSTIFIED}>
        <Circle className="fill-current text-current size-2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupItemRoot>
  );
}
