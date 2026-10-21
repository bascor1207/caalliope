"use client";

import { type ReactNode, useEffect, useState } from "react";

export interface SectionItem {
  id: string;
  label: string;
  children: ReactNode;
}

/**
 * Sur mobile : une barre d'onglets collante et une seule section visible à la fois (les autres restent montées,
 * masquées en CSS : les formulaires gardent leur état et leurs champs). Sur desktop : tout est empilé comme avant.
 * L'onglet actif suit l'ancre de l'URL (#emails…), ce qui permet des sous-menus dans la barre latérale.
 */
export function Sections({ items }: { items: SectionItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  useEffect(() => {
    const read = () => {
      const hash = window.location.hash.slice(1);
      if (items.some((i) => i.id === hash)) {
        setActive(hash);
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
      }
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [items]);
  const select = (id: string) => {
    setActive(id);
    window.history.replaceState(window.history.state, "", `#${id}`);
    window.scrollTo({ top: 0 });
  };
  return (
    <>
      <div
        role="tablist"
        aria-label="Sections"
        className="-mx-5 sticky top-[57px] z-10 mt-5 flex gap-2 overflow-x-auto border-line border-b bg-cream/95 px-5 py-2.5 backdrop-blur [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
      >
        {items.map((i) => (
          <button
            key={i.id}
            type="button"
            role="tab"
            aria-selected={active === i.id}
            aria-controls={`section-${i.id}`}
            onClick={() => select(i.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active === i.id ? "bg-ink text-cream" : "bg-white text-ink-2"}`}
          >
            {i.label}
          </button>
        ))}
      </div>
      {items.map((i) => (
        <section
          key={i.id}
          id={i.id}
          role="tabpanel"
          aria-label={i.label}
          className={`scroll-mt-28 ${active === i.id ? "" : "max-md:hidden"}`}
        >
          {i.children}
        </section>
      ))}
    </>
  );
}
