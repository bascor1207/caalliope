"use client";

import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { Dialog } from "radix-ui";
import { useEffect } from "react";
import { cn } from "./cn";

export interface LightboxImage {
  src: string;
  alt: string;
}

interface Props {
  images: LightboxImage[];
  index: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIndexChange: (index: number) => void;
  labels: { close: string; prev: string; next: string; of: (current: number, total: number) => string; title: string };
}

/** Visionneuse plein écran : flèches, clavier, compteur. Toutes les vues sont montées pour une bascule instantanée. */
export function Lightbox({ images, index, open, onOpenChange, onIndexChange, labels }: Props) {
  const total = images.length;
  const prev = () => onIndexChange((index - 1 + total) % total);
  const next = () => onIndexChange((index + 1) % total);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-90 bg-ink/95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content
          className="fixed inset-0 z-91 flex flex-col outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          onClick={(e) => {
            if (e.target === e.currentTarget) onOpenChange(false);
          }}
        >
          <Dialog.Title className="sr-only">{labels.title}</Dialog.Title>
          <Dialog.Description className="sr-only">{labels.of(index + 1, total)}</Dialog.Description>
          <div className="flex items-center justify-between px-4 py-3 text-cream">
            <span className="font-display text-sm font-bold tabular-nums">{labels.of(index + 1, total)}</span>
            <Dialog.Close
              className="grid size-11 place-items-center rounded-full hover:bg-cream/10"
              aria-label={labels.close}
            >
              <XIcon className="size-6" />
            </Dialog.Close>
          </div>
          <div className="relative flex-1">
            {images.map((img, i) => (
              <Image
                key={img.src}
                src={img.src}
                alt={i === index ? img.alt : ""}
                aria-hidden={i !== index}
                fill
                sizes="100vw"
                className={cn(
                  "object-contain transition-opacity duration-200",
                  i === index ? "opacity-100" : "opacity-0",
                )}
                priority={i === index}
              />
            ))}
          </div>
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label={labels.prev}
                className="absolute top-1/2 left-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-cream/15 text-cream backdrop-blur hover:bg-cream/25"
              >
                <ChevronLeftIcon className="size-6" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label={labels.next}
                className="absolute top-1/2 right-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-cream/15 text-cream backdrop-blur hover:bg-cream/25"
              >
                <ChevronRightIcon className="size-6" />
              </button>
            </>
          )}
          <div className="flex justify-center gap-2 px-4 pt-2 pb-5">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                aria-label={img.alt}
                aria-pressed={i === index}
                onClick={() => onIndexChange(i)}
                className="grid size-6 place-items-center"
              >
                <span
                  aria-hidden="true"
                  className={cn("size-2 rounded-full transition-colors", i === index ? "bg-cream" : "bg-cream/35")}
                />
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
