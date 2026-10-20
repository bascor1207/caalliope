import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/shared/kernel/locale";
import { localizedAlternates } from "@/shared/seo/metadata";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui";
import { InfoPage } from "../../_shell/info-page";

interface Props {
  params: Promise<{ locale: Locale }>;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const HOODIE = { chest: [58, 61, 64, 67, 70, 73], length: [66, 68, 70, 72, 74, 76], sleeve: [58, 59, 60, 61, 62, 63] };
const TEE = { chest: [52, 55, 58, 61, 64, 67], length: [66, 68, 70, 72, 74, 76] };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.sizeGuide" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates(locale, "/guide-des-tailles"),
  };
}

export default async function SizeGuidePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.sizeGuide");
  const tc = await getTranslations("common");

  const table = (title: string, rows: Record<string, number[]>) => (
    <>
      <h2 className="eyebrow !mt-5 !text-sm">{title}</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader scope="col">{t("size")}</TableHeader>
            {SIZES.map((s) => (
              <TableHeader scope="col" key={s}>
                {s}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(rows).map(([key, values]) => (
            <TableRow key={key}>
              <TableHeader scope="row">{t(key as "chest" | "length" | "sleeve")}</TableHeader>
              {values.map((v, i) => (
                <TableCell key={i}>{v}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );

  return (
    <InfoPage
      locale={locale}
      pathname="/guide-des-tailles"
      eyebrow={t("eyebrow")}
      title={
        <>
          {t("heading")} <span className="serif">{t("headingSerif")}</span>
        </>
      }
      breadcrumb={{ home: tc("labels.home"), name: tc("actions.sizeGuide") }}
    >
      <p>{t("intro")}</p>
      {table(t("hoodie"), HOODIE)}
      {table(t("tee"), TEE)}
      <p className="text-xs text-muted">{t("between")}</p>
    </InfoPage>
  );
}
