import { CheckIcon } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui";

interface Props {
  orderRef?: string;
  firstName?: string;
  email?: string;
  total?: number;
}

/**
 * Confirmation rendue depuis l'URL : sur Vercel chaque fonction a sa propre mémoire,
 * on ne relit donc pas la commande in-memory ici.
 */
export async function OrderConfirmation({ orderRef, firstName, email, total }: Props) {
  const t = await getTranslations("checkout.confirmation");
  const tc = await getTranslations("common");
  const format = await getFormatter();
  return (
    <div className="mx-auto max-w-[520px] px-8 py-[60px] text-center">
      <div className="mx-auto mb-6 grid size-[72px] place-items-center rounded-full bg-sage">
        <CheckIcon className="size-8" strokeWidth={2.5} />
      </div>
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="mt-2 text-[34px] tracking-[-0.03em]">
        {t("thanks")}
        {firstName && (
          <>
            , <span className="serif">{firstName}</span>
          </>
        )}
      </h1>
      <p className="mt-3.5 text-ink-2">
        {orderRef && total !== undefined && (
          <>{t.rich("order", { ref: orderRef, total: format.number(total, "eur"), b: (c) => <b>{c}</b> })} </>
        )}
        {email && <>{t.rich("email", { email, b: (c) => <b>{c}</b> })} </>}
        {t("next")}
      </p>
      <Button asChild className="mt-7">
        <Link href="/">{tc("actions.back")}</Link>
      </Button>
    </div>
  );
}
