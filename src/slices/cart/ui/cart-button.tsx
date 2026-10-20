"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, cn } from "@/shared/ui";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { opened, selectCartCount } from "../application/cart.slice";

export function CartButton() {
  const t = useTranslations("header.nav");
  const count = useAppSelector(selectCartCount);
  const dispatch = useAppDispatch();
  return (
    <Button
      variant="icon"
      aria-label={t("openCart", { count })}
      onClick={() => dispatch(opened())}
      className="relative"
    >
      <ShoppingBagIcon className="size-5" aria-hidden="true" />
      {/* key={count} remonte le badge : l'animation bump rejoue à chaque ajout */}
      <span
        key={count}
        aria-hidden="true"
        className={cn(
          "absolute top-1 right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-ink px-[5px] font-display text-[11px] font-bold text-cream transition-transform duration-300 ease-expo",
          count ? "scale-100 animate-bump" : "scale-0",
        )}
      >
        {count}
      </span>
    </Button>
  );
}
