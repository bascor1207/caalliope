"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/shared/ui";

/** Bascule de langue en conservant la route courante (chemins localisés et paramètres compris). */
export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  return (
    <div
      className={cn("inline-flex items-center gap-1 rounded-full bg-ink/6 p-1 text-xs font-semibold", className)}
      role="group"
      aria-label={t("labels.language")}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={l === locale}
          aria-label={`${l.toUpperCase()} – ${t(`locales.${l}`)}`}
          onClick={() => {
            if (l === locale) return;
            // @ts-expect-error pathname + params viennent de la route courante, le typage strict des pathnames ne peut pas les relier.
            router.replace({ pathname, params }, { locale: l });
          }}
          className={cn(
            "rounded-full px-2.5 py-1 uppercase transition-colors",
            l === locale ? "bg-ink text-cream" : "hover:bg-ink/10",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
