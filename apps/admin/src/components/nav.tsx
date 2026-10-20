import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/actions";

const LINKS = [
  ["/", "Tableau de bord"],
  ["/utilisateurs", "Utilisateurs"],
  ["/parametres", "Réglages"],
] as const;

export function AdminNav({ current }: { current: string }) {
  return (
    <nav aria-label="Admin" className="flex flex-wrap items-center gap-2">
      <ul className="inline-flex rounded-full bg-ink/6 p-1 text-sm font-semibold">
        {LINKS.map(([href, label]) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={href === current ? "page" : undefined}
              className={`block whitespace-nowrap rounded-full px-3 py-2 transition-colors sm:px-4 ${href === current ? "bg-ink text-cream" : "hover:bg-ink/10"}`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <form action={logout}>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold hover:border-ink"
        >
          <LogOutIcon className="size-3.5" aria-hidden="true" /> Déconnexion
        </button>
      </form>
    </nav>
  );
}
