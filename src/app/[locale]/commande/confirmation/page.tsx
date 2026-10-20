import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/shared/kernel/locale";
import { OrderConfirmation } from "@/slices/checkout/public-ui";

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ ref?: string; prenom?: string; email?: string; total?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout.confirmation" });
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function ConfirmationPage({ params, searchParams }: Props) {
  const [{ locale }, { ref, prenom, email, total }] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);
  const parsedTotal = total ? Number(total) : undefined;
  return (
    <div className="container-k pt-10 pb-[clamp(72px,10vw,128px)]">
      <OrderConfirmation
        orderRef={ref}
        firstName={prenom}
        email={email}
        total={Number.isFinite(parsedTotal) ? parsedTotal : undefined}
      />
    </div>
  );
}
