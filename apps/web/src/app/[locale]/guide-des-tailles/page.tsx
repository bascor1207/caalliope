import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/shared/kernel/locale";
import { localizedAlternates } from "@/shared/seo/metadata";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui";
import { InfoPage } from "../../_shell/info-page";

interface Props {
  params: Promise<{ locale: Locale }>;
}

type Row = "chest" | "length" | "sleeve";
interface Chart {
  key: "hoodie" | "sweat" | "tee";
  sizes: string[];
  rows: Partial<Record<Row, number[]>>;
}

/** Mesures à plat en cm (hypothèses à valider avec KODA). */
const CHARTS: Chart[] = [
  {
    key: "hoodie",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    rows: { chest: [56, 59, 62, 65, 68, 71], length: [66, 68, 70, 72, 74, 76], sleeve: [58, 59, 60, 61, 62, 63] },
  },
  {
    key: "sweat",
    sizes: ["XS", "S", "M", "L", "XL"],
    rows: { chest: [58, 61, 64, 67, 70], length: [65, 67, 69, 71, 73], sleeve: [55, 56, 57, 58, 59] },
  },
  {
    key: "tee",
    sizes: ["XS", "S", "M", "L", "XL"],
    rows: { chest: [52, 55, 58, 61, 64], length: [66, 68, 70, 72, 74] },
  },
];

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
      {CHARTS.map((chart) => (
        <div key={chart.key} className="contents">
          <h2 className="eyebrow !mt-5 !text-sm">{t(chart.key)}</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader scope="col">{t("size")}</TableHeader>
                {chart.sizes.map((s) => (
                  <TableHeader scope="col" key={s}>
                    {s}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(Object.entries(chart.rows) as Array<[Row, number[]]>).map(([row, values]) => (
                <TableRow key={row}>
                  <TableHeader scope="row">{t(row)}</TableHeader>
                  {values.map((v, i) => (
                    <TableCell key={i}>{v}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
      <p className="text-xs text-muted">{t("between")}</p>
    </InfoPage>
  );
}
