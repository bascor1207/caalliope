import type { ReactNode } from "react";
import { AdminShell } from "@/components/shell";

/** Toutes les pages connectées partagent la barre latérale ; la page de connexion reste hors groupe. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
