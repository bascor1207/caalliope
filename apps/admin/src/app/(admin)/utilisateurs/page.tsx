import type { Metadata } from "next";
import { RoleButton } from "@/components/role-button";
import { listUsers } from "@/lib/users";

export const metadata: Metadata = { title: "Utilisateurs" };
export const dynamic = "force-dynamic";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

export default async function UsersPage() {
  const users = await listUsers();
  const admins = users.filter((u) => u.role === "admin").length;
  return (
    <main className="mx-auto w-full max-w-[1400px] px-5 py-8 md:px-9 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">KODA Clothing</p>
          <h1 className="mt-2 text-[clamp(30px,4vw,44px)] leading-none tracking-[-0.03em]">Utilisateurs</h1>
          <p className="mt-3 text-[15px] text-muted">
            {users.length} comptes · {admins} admin{admins > 1 ? "s" : ""}
          </p>
        </div>
      </header>
      <section className="card mt-10 overflow-x-auto" aria-label="Comptes">
        {users.length === 0 ? (
          <p className="text-[15px] text-muted">
            Aucun compte pour l'instant. Les inscriptions sur la boutique apparaîtront ici.
          </p>
        ) : (
          <table className="w-full text-[15px]">
            <thead className="text-left text-sm text-muted">
              <tr>
                <th scope="col" className="pb-3 font-medium">
                  Nom
                </th>
                <th scope="col" className="pb-3 font-medium">
                  E-mail
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Inscrit le
                </th>
                <th scope="col" className="pb-3 text-right font-medium">
                  Commandes
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Rôle
                </th>
                <th scope="col" className="pb-3 text-right font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-line">
                  <td className="py-3 pr-3 font-medium">
                    {[u.first_name, u.last_name].filter(Boolean).join(" ") || "–"}
                  </td>
                  <td className="py-3 pr-3">{u.email}</td>
                  <td className="py-3 pr-3 text-muted">{fmt(u.created_at)}</td>
                  <td className="py-3 pr-3 text-right tabular-nums">{u.orders}</td>
                  <td className="py-3 text-right" colSpan={2}>
                    <RoleButton
                      id={u.id}
                      role={u.role}
                      name={[u.first_name, u.last_name].filter(Boolean).join(" ") || u.email}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
