import type { Metadata } from "next";
import { supabaseConfigured } from "@/lib/supabase";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <div className="card w-full max-w-[420px] p-7">
        <p className="eyebrow">KODA Clothing</p>
        <h1 className="mt-2 text-[28px] tracking-[-0.03em]">Espace admin</h1>
        <p className="mt-2 text-sm text-muted">Audience, entonnoir d'achat, utilisateurs et réglages de la boutique.</p>
        <LoginForm supabase={supabaseConfigured()} next={next} />
      </div>
    </main>
  );
}
