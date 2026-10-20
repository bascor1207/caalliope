import type { ReactNode } from "react";
import { AdminShell } from "@/components/shell";
import { Toaster } from "@/components/toaster";

/** Toutes les pages connectées partagent la barre latérale et les toasts ; la page de connexion reste hors groupe. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminShell>
      {children}
      <Toaster />
    </AdminShell>
  );
}
