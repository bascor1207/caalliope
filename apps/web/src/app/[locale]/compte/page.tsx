import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/shared/kernel/locale";
import { accountRepository, PaymentMethods } from "@/slices/account/public-server";
import { AddressBook, ProfileForm } from "@/slices/account/public-ui";
import { getSessionUser } from "@/slices/auth/public-server";
import { AccountHeader, EmailChangeForm } from "@/slices/auth/public-ui";
import { ordersRepository } from "@/slices/checkout/public-server";
import { OrderHistory } from "@/slices/checkout/public-ui";

/** Dépend des cookies de session : jamais pré-rendue. */
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  return { title: t("title"), robots: { index: false, follow: false } };
}

const SECTIONS = ["info", "addresses", "payment", "orders"] as const;

/** Espace client : informations, adresses, paiement, commandes (site + Shopify). Toujours dynamique (cookies). */
export default async function AccountPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getSessionUser();
  if (!user) redirect(getPathname({ locale, href: "/connexion" }));
  /* Chaque bloc dégrade seul : une base indisponible ne doit pas rendre l'espace compte inaccessible. */
  const safe = <T,>(label: string, p: Promise<T>, fallback: T) =>
    p.catch((e: unknown) => {
      console.error(`[compte] ${label}`, e);
      return fallback;
    });
  const [orders, profile, addresses, t] = await Promise.all([
    safe("orders", ordersRepository.listForUser(user.id, user.email), []),
    safe("profile", accountRepository.getProfile(user.id), null),
    safe("addresses", accountRepository.listAddresses(user.id), []),
    getTranslations("account"),
  ]);
  return (
    <div className="container-k mx-auto max-w-[880px] pt-10 pb-[clamp(72px,10vw,128px)]">
      <AccountHeader user={user} />
      <nav aria-label={t("title")} className="mt-8 flex gap-2 overflow-x-auto pb-1">
        {SECTIONS.map((s) => (
          <a
            key={s}
            href={`#${s}`}
            className="whitespace-nowrap rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold hover:border-ink"
          >
            {t(`nav.${s}`)}
          </a>
        ))}
      </nav>

      <section id="info" aria-labelledby="info-title" className="mt-10 scroll-mt-28">
        <h2 id="info-title" className="mb-4 text-2xl">
          {t("info")}
        </h2>
        <div className="rounded-card border border-line bg-white p-5 md:p-6">
          <ProfileForm
            profile={profile ?? { firstName: user.firstName ?? "", lastName: user.lastName ?? "", phone: "" }}
            email={user.email}
          />
          <div className="mt-5 border-t border-line pt-5">
            <EmailChangeForm current={user.email} />
          </div>
        </div>
      </section>

      <section id="addresses" aria-labelledby="addresses-title" className="mt-12 scroll-mt-28">
        <h2 id="addresses-title" className="mb-4 text-2xl">
          {t("addresses")}
        </h2>
        <AddressBook addresses={addresses} />
      </section>

      <section id="payment" aria-labelledby="payment-title" className="mt-12 scroll-mt-28">
        <h2 id="payment-title" className="mb-4 text-2xl">
          {t("paymentTitle")}
        </h2>
        <PaymentMethods />
      </section>

      <section id="orders" aria-labelledby="orders-title" className="mt-12 scroll-mt-28">
        <h2 id="orders-title" className="mb-4 text-2xl">
          {t("orders")}
        </h2>
        <OrderHistory orders={orders} />
      </section>
    </div>
  );
}
