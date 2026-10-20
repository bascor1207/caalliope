import { CreditCardIcon, ShieldCheckIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

/**
 * Moyens de paiement enregistrés. Les cartes seront stockées chez Stripe (jamais chez KODA) dès l'activation
 * du paiement Stripe : ce bloc affiche l'état et explique la suite.
 */
export async function PaymentMethods() {
  const t = await getTranslations("account");
  return (
    <div className="rounded-card border border-line bg-white p-5 md:p-6">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink/6">
          <CreditCardIcon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <b className="font-display text-base">{t("payment.none")}</b>
          <p className="mt-1 text-sm text-ink-2">{t("payment.soon")}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted">
            <ShieldCheckIcon className="size-3.5" aria-hidden="true" />
            {t("payment.secure")}
          </p>
        </div>
      </div>
    </div>
  );
}
