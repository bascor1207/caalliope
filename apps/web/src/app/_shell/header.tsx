"use client";

import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Button, Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/shared/ui";
import { CartButton } from "@/slices/cart/public-ui";
import { SearchBox } from "@/slices/catalog/public-ui";
import { LocaleSwitcher } from "./locale-switcher";

type NavItem = {
  key: "drop" | "hoodies" | "sweats" | "tees" | "story" | "faq";
  href: Parameters<typeof Link>[0]["href"];
};

const NAV: NavItem[] = [
  { key: "drop", href: { pathname: "/", hash: "drop" } },
  { key: "hoodies", href: { pathname: "/", query: { filtre: "hoodie" }, hash: "drop" } },
  { key: "sweats", href: { pathname: "/", query: { filtre: "sweat" }, hash: "drop" } },
  { key: "tees", href: { pathname: "/", query: { filtre: "tee" }, hash: "drop" } },
  { key: "story", href: { pathname: "/", hash: "histoire" } },
  { key: "faq", href: { pathname: "/", hash: "faq" } },
];

/** Shell : compose les slices (recherche catalogue, bouton panier) sans logique métier. */
export function Header() {
  const t = useTranslations("header.nav");
  const ts = useTranslations("header.search");
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 flex h-header items-center border-b border-line bg-cream/78 backdrop-blur-[14px] backdrop-saturate-[160%]">
      <div className="container-k grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="icon" aria-label={t("openMenu")} className="lg:hidden">
              <MenuIcon className="size-[22px]" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" closeLabel={t("closeMenu")} hideClose>
            <SheetTitle className="sr-only">{t("openMenu")}</SheetTitle>
            <SheetDescription className="sr-only">{t("drop")}</SheetDescription>
            <SheetClose asChild>
              <Button variant="icon" aria-label={t("closeMenu")} className="absolute top-4 right-4">
                <XIcon className="size-[22px]" />
              </Button>
            </SheetClose>
            {NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display text-[clamp(36px,10vw,60px)] font-bold tracking-[-0.03em] py-1.5"
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/recherche" onClick={() => setOpen(false)}>
                  {ts("cta")}
                </Link>
              </Button>
              <LocaleSwitcher />
            </div>
          </SheetContent>
        </Sheet>

        <Link
          className="justify-self-center inline-flex items-center gap-2 font-display text-[24px] font-bold tracking-[-0.05em] lg:justify-self-start"
          href="/"
          aria-label={tc("a11y.brandHome")}
        >
          <span className="size-2 rounded-full bg-sage shadow-[0_0_0_4px_rgba(191,211,193,.35)]" aria-hidden="true" />
          KODA
        </Link>

        <nav className="hidden justify-center gap-7 lg:flex" aria-label="Navigation">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="relative py-1.5 text-sm font-medium after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-right after:scale-x-0 after:bg-ink after:transition-transform after:duration-300 after:ease-expo hover:after:origin-left hover:after:scale-x-100"
              aria-current={isHome && item.key === "drop" ? "page" : undefined}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1.5">
          <SearchBox className="hidden xl:block" />
          <Button asChild variant="icon" className="xl:hidden">
            <Link href="/recherche" aria-label={t("search")}>
              <SearchIcon className="size-5" />
            </Link>
          </Button>
          <LocaleSwitcher className="hidden lg:inline-flex" />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
