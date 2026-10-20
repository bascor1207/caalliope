"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/ui";

interface Props {
  src: string;
  poster?: string;
  className?: string;
  /** Nombre de lectures avant de s'arrêter sur la dernière image (0 = sans fin). */
  loops?: number;
}

/**
 * Vidéo de marque : lecture automatique, muette, en boucle un nombre limité de fois, puis pause sur la dernière image.
 * Un bouton lecture / pause laisse la main au visiteur. Si le fichier manque, le bloc se replie sans erreur.
 */
export function BrandVideo({ src, poster, className, loops = 3 }: Props) {
  const t = useTranslations("home.video");
  const ref = useRef<HTMLVideoElement>(null);
  const plays = useRef(0);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onEnded = () => {
      plays.current += 1;
      if (loops > 0 && plays.current >= loops) {
        setPlaying(false);
        return;
      }
      el.currentTime = 0;
      void el.play();
    };
    el.addEventListener("ended", onEnded);
    return () => el.removeEventListener("ended", onEnded);
  }, [loops]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused || el.ended) {
      if (el.ended) {
        plays.current = 0;
        el.currentTime = 0;
      }
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  if (failed) return null;
  return (
    <>
      <video
        ref={ref}
        className={cn("h-full w-full object-cover", className)}
        src={src}
        poster={poster}
        autoPlay
        muted
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        tabIndex={-1}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? t("pause") : t("play")}
        className="absolute top-4 right-4 z-10 grid size-11 place-items-center rounded-full bg-white/85 text-ink backdrop-blur transition-colors hover:bg-white md:top-6 md:right-6"
      >
        {playing ? (
          <PauseIcon className="size-4" aria-hidden="true" />
        ) : (
          <PlayIcon className="size-4" aria-hidden="true" />
        )}
      </button>
    </>
  );
}
