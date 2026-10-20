"use client";

import { createClient } from "@supabase/supabase-js";
import { UploadIcon } from "lucide-react";
import { useId, useState } from "react";
import { requestUpload } from "@/app/media-actions";

interface Props {
  folder: "products" | "marketing";
  accept: string;
  label: string;
  onUploaded: (publicUrl: string) => void;
  className?: string;
}

/**
 * Envoi direct du navigateur vers Supabase Storage : le serveur ne signe qu'un ticket,
 * le fichier (photo ou vidéo) ne passe jamais par Vercel. Jusqu'à 50 Mo par fichier.
 */
export function MediaUpload({ folder, accept, label, onUploaded, className = "" }: Props) {
  const id = useId();
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");
  const [error, setError] = useState("");

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setState("busy");
    setError("");
    try {
      const ticket = await requestUpload(folder, file.name);
      if ("error" in ticket) throw new Error(ticket.error);
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
        { auth: { persistSession: false } },
      );
      const { error: upErr } = await supabase.storage
        .from("media")
        .uploadToSignedUrl(ticket.path, ticket.token, file, { contentType: file.type, upsert: true });
      if (upErr) throw new Error(upErr.message);
      onUploaded(ticket.publicUrl);
      setState("idle");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setState("error");
    }
  };

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold hover:border-ink"
      >
        <UploadIcon className="size-4" aria-hidden="true" />
        {state === "busy" ? "Envoi…" : label}
      </label>
      <input
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={state === "busy"}
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      {state === "error" && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
