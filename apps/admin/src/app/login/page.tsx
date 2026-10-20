import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <div className="card w-full max-w-[400px] p-7">
        <p className="eyebrow">KODA Clothing</p>
        <h1 className="mt-2 text-[28px] font-extrabold tracking-[-0.04em]">Espace admin</h1>
        <p className="mt-2 text-sm text-muted">Audience, entonnoir d'achat et frictions de la boutique.</p>
        <LoginForm />
      </div>
    </main>
  );
}
