import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/shared/kernel/locale";
import { accountRepository, pickDefault } from "@/slices/account/public-server";
import { getSessionUser } from "@/slices/auth/public-server";
import type { CheckoutPrefill } from "@/slices/checkout/public-ui";
import { CheckoutSection } from "./checkout-section";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout.form" });
  return { title: t("title"), robots: { index: false, follow: false } };
}

/** Dépend des cookies (client connecté → formulaire pré-rempli depuis son compte). */
export const dynamic = "force-dynamic";

/** E-mail et adresse par défaut du client connecté ; vide pour un visiteur. */
async function prefillFor(): Promise<CheckoutPrefill> {
  const user = await getSessionUser();
  if (!user) return {};
  const address = pickDefault(await accountRepository.listAddresses(user.id));
  return {
    email: user.email,
    firstName: address?.firstName ?? user.firstName ?? "",
    lastName: address?.lastName ?? user.lastName ?? "",
    address: address ? [address.line1, address.line2].filter(Boolean).join(", ") : "",
    zip: address?.zip ?? "",
    city: address?.city ?? "",
  };
}

export default async function CheckoutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const prefill = await prefillFor();
  return (
    <div className="container-k pt-10 pb-[clamp(72px,10vw,128px)]">
      <CheckoutSection prefill={prefill} />
    </div>
  );
}
