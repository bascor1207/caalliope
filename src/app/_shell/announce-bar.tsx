import { getTranslations } from "next-intl/server";

export async function AnnounceBar() {
  const t = await getTranslations("header.announce");
  const items = t("items").split("|");
  return (
    <div
      className="flex h-9 items-center overflow-hidden whitespace-nowrap bg-ink text-[12.5px] font-medium uppercase tracking-[0.04em] text-cream"
      role="region"
      aria-label="Annonces"
    >
      <div className="marquee-track gap-12 pl-6 animate-marquee" aria-hidden="true">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="after:ml-12 after:opacity-50 after:content-['✦']">
            {item}
          </span>
        ))}
      </div>
      <p className="sr-only">{items.join(". ")}.</p>
    </div>
  );
}
