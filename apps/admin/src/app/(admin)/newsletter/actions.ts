"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { CampaignContent } from "@/lib/email-template";
import {
  createCampaign,
  deleteCampaign,
  deleteSubscriber,
  sendCampaign,
  sendTest,
  updateCampaign,
} from "@/lib/newsletter";

const contentFrom = (f: FormData): CampaignContent => ({
  subject: String(f.get("subject") ?? "").slice(0, 150),
  preheader: String(f.get("preheader") ?? "").slice(0, 200),
  title: String(f.get("title") ?? "").slice(0, 150),
  body: String(f.get("body") ?? "").slice(0, 40_000),
  ctaLabel: String(f.get("ctaLabel") ?? "").slice(0, 60),
  ctaUrl: String(f.get("ctaUrl") ?? "").slice(0, 500),
  imageUrl: String(f.get("imageUrl") ?? "").slice(0, 500),
});

export async function newCampaign() {
  const id = await createCampaign();
  redirect(`/newsletter/campagnes/${id}`);
}

export interface EditorState {
  message: string | null;
  kind: "ok" | "error" | null;
}

export async function saveCampaign(id: string, _prev: EditorState, f: FormData): Promise<EditorState> {
  await updateCampaign(id, contentFrom(f));
  revalidatePath(`/newsletter/campagnes/${id}`);
  return { message: "Brouillon enregistré.", kind: "ok" };
}

export async function sendTestCampaign(id: string, _prev: EditorState, f: FormData): Promise<EditorState> {
  const content = contentFrom(f);
  await updateCampaign(id, content);
  const to = String(f.get("testTo") ?? "").trim();
  if (!to) return { message: "Indique une adresse de test.", kind: "error" };
  const r = await sendTest(content, to);
  return r.ok
    ? { message: `E-mail de test envoyé à ${to}.`, kind: "ok" }
    : { message: `Échec : ${r.error}`, kind: "error" };
}

export async function launchCampaign(id: string, _prev: EditorState, f: FormData): Promise<EditorState> {
  await updateCampaign(id, contentFrom(f));
  const r = await sendCampaign(id);
  revalidatePath(`/newsletter/campagnes/${id}`);
  revalidatePath("/newsletter/campagnes");
  const parts = [
    `${r.sent} envoyé(s)`,
    r.failed ? `${r.failed} en échec` : null,
    r.remaining ? `${r.remaining} restant(s) : relance l'envoi plus tard (limite quotidienne)` : null,
  ].filter(Boolean);
  return { message: parts.join(" · "), kind: r.failed || r.remaining ? "error" : "ok" };
}

export async function removeCampaign(f: FormData) {
  await deleteCampaign(String(f.get("id") ?? ""));
  revalidatePath("/newsletter/campagnes");
}

export async function removeSubscriber(f: FormData) {
  const id = String(f.get("id") ?? "");
  if (id) await deleteSubscriber(id);
  revalidatePath("/newsletter");
}
