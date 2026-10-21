"use client";

import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import type { AuthFeatures } from "../domain/user";
import { LoginForm } from "./auth-forms";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  features: AuthFeatures;
  /** Chemin complet où revenir après une connexion Google/Apple (qui passent par une redirection). */
  next?: string;
}

/** Connexion sans quitter la page (achat express…) : la session se met à jour sur place une fois connecté. */
export function LoginDialog({ open, onOpenChange, features, next }: Props) {
  const t = useTranslations("auth");
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-80 bg-ink/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-81 max-h-[92dvh] overflow-y-auto rounded-t-[28px] bg-cream p-5 outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-8 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[min(460px,calc(100vw-32px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-card sm:p-7 sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:slide-in-from-bottom-0"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">{t("eyebrow")}</p>
              <Dialog.Title className="mt-1.5 font-display text-[clamp(26px,4vw,34px)] font-bold leading-none tracking-[-0.04em]">
                {t("loginTitle")} <span className="serif">{t("loginSerif")}</span>
              </Dialog.Title>
            </div>
            <Dialog.Close
              className="-mt-1 -mr-1 grid size-11 shrink-0 place-items-center rounded-full hover:bg-ink/6"
              aria-label={t("cancel")}
            >
              <XIcon className="size-5" />
            </Dialog.Close>
          </div>
          <div className="mt-6">
            <LoginForm features={features} next={next} onSuccess={() => onOpenChange(false)} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
