"use client";

import { XIcon } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "./cn";

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetTitle = SheetPrimitive.Title;
export const SheetDescription = SheetPrimitive.Description;

function SheetOverlay({ className, ...props }: ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-80 bg-ink/45 backdrop-blur-[4px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

interface SheetContentProps extends ComponentProps<typeof SheetPrimitive.Content> {
  side?: "right" | "top";
  closeLabel: string;
  /** Masque le bouton de fermeture par défaut (menu plein écran avec sa propre croix). */
  hideClose?: boolean;
}

/** Panneau latéral (panier) ou plein écran depuis le haut (menu mobile), accessible via Radix Dialog. */
export function SheetContent({
  className,
  children,
  side = "right",
  closeLabel,
  hideClose,
  ...props
}: SheetContentProps) {
  return (
    <SheetPrimitive.Portal>
      <SheetOverlay />
      <SheetPrimitive.Content
        className={cn(
          "fixed z-81 bg-cream outline-none transition ease-expo data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-500 data-[state=closed]:duration-300",
          side === "right" &&
            "inset-y-0 right-0 flex h-dvh w-[min(440px,100vw)] flex-col data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
          side === "top" &&
            "inset-0 grid h-dvh w-full content-center gap-2 p-6 data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
          className,
        )}
        {...props}
      >
        {children}
        {!hideClose && (
          <SheetPrimitive.Close className="absolute top-4 right-4 inline-flex size-[42px] items-center justify-center rounded-full hover:bg-ink/6">
            <XIcon className="size-[22px]" />
            <span className="sr-only">{closeLabel}</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}
