"use client";

import { useState } from "react";
import { cn } from "@/shared/ui";

interface Props {
  src: string;
  poster?: string;
  className?: string;
}

/**
 * Vidéo de marque en lecture automatique, muette, en boucle (comportement attendu sur mobile).
 * Si le fichier manque (pas encore déposé dans public/media), le bloc se replie sans erreur visible.
 */
export function BrandVideo({ src, poster, className }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <video
      className={cn("h-full w-full object-cover", className)}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onError={() => setFailed(true)}
      tabIndex={-1}
    />
  );
}
