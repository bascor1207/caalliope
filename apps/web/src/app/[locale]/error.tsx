"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { eventBus } from "@/shared/event-bus";
import { Button } from "@/shared/ui";

/**
 * Erreur de rendu d'une page : le layout (header, footer, panier) reste en place, on propose de réessayer.
 * L'erreur est remontée au bus → analytics (« page_error ») pour le compteur du back-office.
 */
export default function PageError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("pages.error");
  const tc = useTranslations("common");
  useEffect(() => {
    console.error(error);
    eventBus.publish("app.error-caught", { digest: error.digest ?? "", message: error.message.slice(0, 160) });
  }, [error]);
  return (
    <div className="container-k mx-auto max-w-[760px] py-24 text-center">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="my-3 text-[clamp(36px,5.5vw,64px)] tracking-[-0.04em]">
        {t("title")} <span className="serif">{t("titleSerif")}</span>
      </h1>
      <p className="mb-7 text-ink-2">{t("text")}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={reset}>
          {t("retry")}
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">{tc("labels.home")}</Link>
        </Button>
      </div>
      {error.digest && <p className="mt-8 text-xs text-muted">{t("ref", { digest: error.digest })}</p>}
    </div>
  );
}
