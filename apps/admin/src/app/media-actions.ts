"use server";

import { createUploadTicket, storageConfigured, type UploadTicket } from "@/lib/storage";

/** Ticket d'envoi signé pour le composant MediaUpload. */
export async function requestUpload(
  folder: "products" | "marketing",
  filename: string,
): Promise<UploadTicket | { error: string }> {
  if (!storageConfigured()) return { error: "Stockage non configuré (SUPABASE_SERVICE_ROLE_KEY absente)." };
  try {
    return await createUploadTicket(folder, filename);
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}
