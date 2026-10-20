import type { ReactNode } from "react";
import { AdminBreadcrumb } from "@/components/breadcrumb";
import { AdminShell } from "@/components/shell";
import { Toaster } from "@/components/toaster";

/** Pages connectées : barre latérale, fil d'Ariane + retour, toasts. La page de connexion reste hors groupe. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminShell>
      <div className="mx-auto w-full max-w-[1400px] px-5 pt-5 md:px-9 md:pt-6">
        <AdminBreadcrumb />
      </div>
      {children}
      <Toaster />
    </AdminShell>
  );
}
