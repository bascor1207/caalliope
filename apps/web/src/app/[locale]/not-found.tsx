import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui";

export default function NotFound() {
  const t = useTranslations("pages.notFound");
  const tc = useTranslations("common");
  return (
    <div className="container-k mx-auto max-w-[760px] py-24 text-center">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="my-3 text-[clamp(36px,5.5vw,64px)] tracking-[-0.04em]">
        {t("title")} <span className="serif">{t("titleSerif")}</span>
      </h1>
      <p className="mb-7 text-ink-2">{t("text")}</p>
      <Button asChild>
        <Link href={{ pathname: "/", hash: "drop" }}>{tc("actions.seeDrop")}</Link>
      </Button>
    </div>
  );
}
