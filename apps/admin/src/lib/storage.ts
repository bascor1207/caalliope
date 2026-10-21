import { createClient } from "@supabase/supabase-js";

const BUCKET = "media";
const url = () => process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const storageConfigured = () => Boolean(url() && serviceKey());

/** Vidéos de marque sur Cloudflare R2 (bucket public, trafic sortant illimité) : `marketing/<nom>.mp4` + affiche `.jpg`. */
const MEDIA_CDN = process.env.MEDIA_CDN_URL ?? "https://pub-af8df0f2ece54610a0bb91f01b8e7fe1.r2.dev";
export const defaultVideo = (name: string) => ({
  src: `${MEDIA_CDN}/marketing/${name}.mp4`,
  poster: `${MEDIA_CDN}/marketing/${name}.jpg`,
});

const admin = () => createClient(url(), serviceKey(), { auth: { persistSession: false, autoRefreshToken: false } });

const slugify = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export interface UploadTicket {
  path: string;
  token: string;
  publicUrl: string;
}

/**
 * Ticket d'envoi direct navigateur → Supabase Storage (URL signée, valable 2 h) : les vidéos ne transitent
 * jamais par Vercel (limite 4,5 Mo des fonctions). Bucket public `media`, 1 Go offerts.
 */
export async function createUploadTicket(folder: string, filename: string): Promise<UploadTicket> {
  const path = `${folder.replace(/[^a-z0-9-]/g, "")}/${Date.now().toString(36)}-${slugify(filename) || "fichier"}`;
  const storage = admin().storage.from(BUCKET);
  const { data, error } = await storage.createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message ?? "upload-ticket");
  return { path: data.path, token: data.token, publicUrl: storage.getPublicUrl(data.path).data.publicUrl };
}

/** Supprime un fichier du bucket s'il nous appartient (URL publique du bucket `media`). */
export async function removeMedia(publicUrl: string): Promise<void> {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = publicUrl.indexOf(marker);
  if (i < 0) return;
  await admin()
    .storage.from(BUCKET)
    .remove([decodeURIComponent(publicUrl.slice(i + marker.length))]);
}
