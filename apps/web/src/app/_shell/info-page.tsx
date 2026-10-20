import type { ReactNode } from "react";
import type { AppPathname } from "@/i18n/routing";
import type { Locale } from "@/shared/kernel/locale";
import { breadcrumbJsonLd, pathFor } from "@/shared/seo/metadata";
import { JsonLd } from "@/shared/ui";

interface Props {
  locale: Locale;
  pathname: AppPathname;
  eyebrow: string;
  title: ReactNode;
  breadcrumb: { home: string; name: string };
  children: ReactNode;
}

/** Gabarit des pages éditoriales (livraison, CGV, confidentialité, guide des tailles). */
export function InfoPage({ locale, pathname, eyebrow, title, breadcrumb, children }: Props) {
  return (
    <div className="container-k mx-auto max-w-[760px] pt-10 pb-[clamp(72px,10vw,128px)]">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: breadcrumb.home, url: pathFor(locale, "/") },
          { name: breadcrumb.name, url: pathFor(locale, pathname) },
        ])}
      />
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="my-3 mb-6 text-[clamp(36px,5.5vw,64px)] tracking-[-0.04em]">{title}</h1>
      <div className="grid gap-4 text-base leading-[1.65] text-ink-2 [&_h2]:mt-4 [&_h2]:text-[22px] [&_h2]:tracking-[-0.02em] [&_h2]:text-ink [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-[22px] [&_b]:text-ink">
        {children}
      </div>
    </div>
  );
}
