import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/shared/kernel/locale";
import { getSessionUser } from "@/slices/auth/public-server";
import { AccountHeader } from "@/slices/auth/public-ui";
import { ordersRepository } from "@/slices/checkout/public-server";
import { OrderHistory } from "@/slices/checkout/public-ui";

/** Dépend des cookies de session : jamais pré-rendue. */
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("myAccount"), robots: { index: false, follow: false } };
}

/** Espace client : identité et historique des commandes (site + Shopify). Toujours dynamique (cookies). */
export default async function AccountPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getSessionUser();
  if (!user) redirect(getPathname({ locale, href: "/connexion" }));
  const [orders, t] = await Promise.all([ordersRepository.listForUser(user.id, user.email), getTranslations("auth")]);
  return (
    <div className="container-k mx-auto max-w-[820px] pt-10 pb-[clamp(72px,10vw,128px)]">
      <AccountHeader user={user} />
      <h2 className="mt-10 mb-4 text-2xl">{t("orders")}</h2>
      <OrderHistory orders={orders} />
    </div>
  );
}
