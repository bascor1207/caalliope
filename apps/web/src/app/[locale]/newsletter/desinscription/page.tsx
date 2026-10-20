import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/shared/kernel/locale";
import { Button } from "@/shared/ui";
import { subscribersRepository } from "@/slices/newsletter/public-server";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ token?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "newsletter" });
  return { title: t("unsubscribeTitle"), robots: { index: false, follow: false } };
}

/** Lien de désinscription présent dans chaque e-mail : un clic, aucune connexion demandée. */
export default async function UnsubscribePage({ params, searchParams }: Props) {
  const [{ locale }, { token }] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);
  const t = await getTranslations("newsletter");
  const ok = token ? await subscribersRepository.unsubscribe(token).catch(() => false) : false;
  return (
    <div className="container-k mx-auto max-w-[560px] pt-10 pb-[clamp(72px,10vw,128px)] text-center">
      <p className="eyebrow">Newsletter</p>
      <h1 className="mt-2 text-[clamp(30px,5vw,48px)] tracking-[-0.03em]">{t("unsubscribeTitle")}</h1>
      <p className="mt-4 text-ink-2">{ok ? t("unsubscribed") : t("unsubscribeInvalid")}</p>
      <Button asChild className="mt-7">
        <Link href="/">{t("backHome")}</Link>
      </Button>
    </div>
  );
}
