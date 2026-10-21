"use client";

import { CopyIcon, MegaphoneIcon, SparklesIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui";
import type { Announcement } from "../domain/announcement";

const KEY = "koda.announcement.seen";
const TONE = {
  info: { bg: "bg-sage/40", icon: MegaphoneIcon },
  warning: { bg: "bg-sand", icon: TriangleAlertIcon },
  promo: { bg: "bg-lavender/60", icon: SparklesIcon },
} as const;

/**
 * Modale d'annonce : affichée une fois par version (clé mémorisée dans le navigateur, aucun cookie),
 * après un court délai pour ne pas sauter au visage. Fermée = vue ; une nouvelle version la réaffiche.
 */
export function AnnouncementDialog({ announcement }: { announcement: Announcement | null }) {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const id = announcement?.id;

  useEffect(() => {
    if (!id) return;
    try {
      if (localStorage.getItem(KEY) === id) return;
    } catch {}
    const timer = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(timer);
  }, [id]);

  if (!announcement) return null;
  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(KEY, announcement.id);
    } catch {}
  };
  const { bg, icon: Icon } = TONE[announcement.kind];
  const copy = async () => {
    if (!announcement.code) return;
    try {
      await navigator.clipboard.writeText(announcement.code);
      setCopied(true);
    } catch {}
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-80 bg-ink/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-81 max-h-[92dvh] overflow-y-auto rounded-t-[28px] bg-cream p-5 outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-8 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[min(560px,calc(100vw-32px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-card sm:p-7 sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:slide-in-from-bottom-0">
          <div className="flex items-start justify-between gap-4">
            <span className={`grid size-12 shrink-0 place-items-center rounded-full ${bg}`}>
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <Dialog.Close
              className="-mt-1 -mr-1 grid size-11 shrink-0 place-items-center rounded-full hover:bg-ink/6"
              aria-label={t("actions.close")}
            >
              <XIcon className="size-5" />
            </Dialog.Close>
          </div>
          <Dialog.Title className="mt-4 font-display text-[clamp(24px,4vw,34px)] font-bold leading-[1.05] tracking-[-0.03em]">
            {announcement.title}
          </Dialog.Title>
          <Dialog.Description className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink-2">
            {announcement.text}
          </Dialog.Description>
          {announcement.code && (
            <button
              type="button"
              onClick={copy}
              className="mt-4 inline-flex items-center gap-2 rounded-[12px] border border-dashed border-ink/40 bg-white px-4 py-2.5 font-display text-base font-bold tracking-[0.08em]"
            >
              {announcement.code}
              <CopyIcon className="size-4 text-muted" aria-hidden="true" />
              <span className="sr-only">{copied ? t("actions.copied") : t("actions.copy")}</span>
            </button>
          )}
          {copied && (
            <p role="status" className="mt-2 text-sm text-success">
              {t("actions.copied")}
            </p>
          )}
          <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={close}>
              {t("actions.close")}
            </Button>
            {announcement.ctaLabel && announcement.ctaUrl && (
              <Button asChild>
                <a href={announcement.ctaUrl} onClick={close} data-track="announcement.cta">
                  {announcement.ctaLabel}
                </a>
              </Button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
