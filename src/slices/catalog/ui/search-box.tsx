"use client";

import { SearchIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/shared/kernel/locale";
import { cn, Price, ProductArt } from "@/shared/ui";
import { useSearchQuery } from "../application/catalog.api";

const MIN = 2;

/**
 * Recherche instantanée du header : RTK Query (cache + dédoublonnage) sur la Server Action.
 * Entrée + Entrée = page de résultats. Raccourci clavier `/`.
 */
export function SearchBox({ className }: { className?: string }) {
  const t = useTranslations("header.search");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value.trim()), 180);
    return () => window.clearTimeout(id);
  }, [value]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !/input|textarea/i.test((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: on referme la liste à chaque navigation.
  useEffect(() => setOpen(false), [pathname]);

  const { data: hits = [], isFetching } = useSearchQuery(
    { query: debounced, locale },
    { skip: debounced.length < MIN },
  );
  const showList = open && debounced.length >= MIN;

  return (
    <form
      role="search"
      className={cn("relative", className)}
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim()) return;
        setOpen(false);
        router.push({ pathname: "/recherche", query: { q: value.trim() } });
      }}
    >
      <div className="flex h-[42px] items-center gap-2 rounded-full bg-ink/6 pr-1 pl-3.5">
        <SearchIcon className="size-4 shrink-0" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          name="q"
          role="combobox"
          aria-autocomplete="list"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          placeholder={t("placeholder")}
          aria-label={t("aria")}
          aria-controls={listId}
          aria-expanded={showList}
          autoComplete="off"
          className="w-[150px] bg-transparent text-sm outline-none [&::-webkit-search-cancel-button]:hidden"
        />
      </div>
      {showList && (
        <div
          id={listId}
          className="absolute top-[calc(100%+8px)] right-0 z-60 w-[380px] overflow-hidden rounded-[18px] border border-line bg-cream p-2 shadow-[0_30px_60px_-30px_rgba(20,20,20,.4)]"
        >
          <p className="px-3 pt-1 pb-2 text-[11px] uppercase tracking-[0.14em] text-muted">
            {t("suggestions")}
            {isFetching && " …"}
          </p>
          {hits.slice(0, 5).map(({ product, color }) => (
            <Link
              key={`${product.id}-${color.key}`}
              href={{ pathname: "/produits/[slug]", params: { slug: product.slug }, query: { coloris: color.key } }}
              className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-xl px-2.5 py-2 hover:bg-ink/5"
              style={{ "--c": color.hex } as React.CSSProperties}
            >
              <span className="grid aspect-[4/5] w-11 place-items-center rounded-lg bg-[var(--c)]">
                <ProductArt kind={product.type} color={color.hex} className="w-[60%]" />
              </span>
              <span>
                <b className="block text-[13px]">
                  {product.name} · {color.name}
                </b>
                <small className="text-xs text-muted">{product.sub}</small>
              </span>
              <Price amount={product.price} className="font-display text-sm font-bold" />
            </Link>
          ))}
          <Link
            href={{ pathname: "/recherche", query: { q: debounced } }}
            className="mt-1 block rounded-xl px-3 py-2.5 text-[13px] font-semibold underline-offset-[3px] hover:underline"
          >
            {t("seeAll", { q: debounced })}
          </Link>
        </div>
      )}
    </form>
  );
}
