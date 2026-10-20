"use client";

import {
  LayoutDashboardIcon,
  LogOutIcon,
  MailIcon,
  MenuIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SettingsIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { logout } from "@/app/actions";

export const ADMIN_LINKS = [
  { href: "/", label: "Tableau de bord", Icon: LayoutDashboardIcon },
  { href: "/utilisateurs", label: "Utilisateurs", Icon: UsersIcon },
  { href: "/newsletter", label: "Newsletter", Icon: MailIcon },
  { href: "/parametres", label: "Réglages", Icon: SettingsIcon },
] as const;

const KEY = "koda.admin.sidebar";

const isActive = (href: string, path: string) => (href === "/" ? path === "/" : path.startsWith(href));

/**
 * Coque de l'admin : barre latérale partout. Sur desktop elle se replie en colonne d'icônes (état mémorisé) ;
 * sur mobile elle est un tiroir ouvert par le bouton menu, refermé au changement de page ou à Échap.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(KEY) === "collapsed");
    } catch {}
  }, []);
  // biome-ignore lint/correctness/useExhaustiveDependencies: le tiroir se referme à chaque changement de page.
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(KEY, next ? "collapsed" : "open");
    } catch {}
  };
  const iconOnly = collapsed ? "md:justify-center md:px-0" : "";

  return (
    <div className="min-h-dvh md:flex">
      {/* Barre mobile : bouton menu + marque */}
      <div className="sticky top-0 z-30 flex items-center gap-2 border-line border-b bg-white px-3 py-2 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          aria-controls="admin-sidebar"
          className="grid size-11 place-items-center rounded-[12px] hover:bg-ink/6"
        >
          <MenuIcon className="size-5" aria-hidden="true" />
        </button>
        <Link href="/" className="flex items-center gap-2.5 font-display text-[17px] font-semibold tracking-[-0.02em]">
          {/* biome-ignore lint/performance/noImgElement: petit logo statique */}
          <img src="/icon.png" alt="" width={28} height={28} className="size-7 rounded-[8px]" />
          KODA <span className="text-muted">Admin</span>
        </Link>
      </div>

      {open && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[1px] md:hidden"
        />
      )}

      <aside
        id="admin-sidebar"
        aria-label="Navigation admin"
        className={`fixed inset-y-0 left-0 z-50 w-[272px] border-line border-r bg-white transition-transform duration-300 ease-out max-md:shadow-[0_20px_60px_-20px_rgba(20,20,20,.4)] md:sticky md:top-0 md:z-20 md:h-dvh md:shrink-0 md:translate-x-0 md:transition-[width] ${open ? "translate-x-0" : "-translate-x-full"} ${collapsed ? "md:w-[76px]" : "md:w-[248px]"}`}
      >
        <div className="flex h-full flex-col px-3 py-4">
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2.5 rounded-[12px] px-2 py-2 hover:bg-ink/5"
              aria-label="KODA Admin, tableau de bord"
            >
              {/* biome-ignore lint/performance/noImgElement: petit logo statique */}
              <img src="/icon.png" alt="" width={32} height={32} className="size-8 shrink-0 rounded-[9px]" />
              <span
                className={`font-display text-[17px] font-semibold tracking-[-0.02em] ${collapsed ? "md:hidden" : ""}`}
              >
                KODA <span className="text-muted">Admin</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="grid size-10 shrink-0 place-items-center rounded-[12px] hover:bg-ink/6 md:hidden"
            >
              <XIcon className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav className="mt-5 flex-1">
            <ul className="grid gap-1">
              {ADMIN_LINKS.map(({ href, label, Icon }) => {
                const active = isActive(href, path);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      title={collapsed ? label : undefined}
                      className={`flex items-center gap-3 whitespace-nowrap rounded-[12px] px-3 py-2.5 text-[15px] font-semibold transition-colors ${active ? "bg-ink text-cream" : "hover:bg-ink/6"} ${iconOnly}`}
                    >
                      <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                      <span className={collapsed ? "md:sr-only" : ""}>{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto grid gap-1">
            <form action={logout}>
              <button
                type="submit"
                title={collapsed ? "Déconnexion" : undefined}
                className={`flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-[15px] font-semibold text-ink-2 hover:bg-ink/6 ${iconOnly}`}
              >
                <LogOutIcon className="size-[18px] shrink-0" aria-hidden="true" />
                <span className={collapsed ? "md:sr-only" : ""}>Déconnexion</span>
              </button>
            </form>
            <button
              type="button"
              onClick={toggle}
              aria-expanded={!collapsed}
              aria-label={collapsed ? "Déplier la barre latérale" : "Replier la barre latérale"}
              className={`hidden items-center gap-3 rounded-[12px] px-3 py-2.5 text-[15px] font-semibold text-muted hover:bg-ink/6 md:flex ${iconOnly}`}
            >
              {collapsed ? (
                <PanelLeftOpenIcon className="size-[18px] shrink-0" aria-hidden="true" />
              ) : (
                <PanelLeftCloseIcon className="size-[18px] shrink-0" aria-hidden="true" />
              )}
              {!collapsed && <span>Replier</span>}
            </button>
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
