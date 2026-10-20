import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/shared/kernel/locale";
import { getAuthFeatures, getSessionUser } from "@/slices/auth/public-server";
import { LoginForm } from "@/slices/auth/public-ui";

/** Dépend des cookies de session : jamais pré-rendue. */
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("loginTitle"), robots: { index: false, follow: true } };
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [user, features, t] = await Promise.all([getSessionUser(), getAuthFeatures(), getTranslations("auth")]);
  if (user) redirect(getPathname({ locale, href: "/compte" }));
  return (
    <div className="container-k mx-auto max-w-[460px] pt-10 pb-[clamp(72px,10vw,128px)]">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="mt-2 mb-6 text-[clamp(30px,5vw,48px)] tracking-[-0.03em]">
        {t("loginTitle")} <span className="serif">{t("loginSerif")}</span>
      </h1>
      <LoginForm features={features} />
    </div>
  );
}
