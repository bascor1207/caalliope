"use client";

import { UserIcon, UserRoundCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui";
import { useSession } from "./session-store";

/** Icône compte du header : vers le compte si connecté, vers la connexion sinon. */
export function AccountMenu() {
  const t = useTranslations("auth");
  const session = useSession();
  const connected = session.status === "authenticated";
  return (
    <Button asChild variant="icon">
      <Link
        href={connected ? "/compte" : "/connexion"}
        aria-label={connected ? t("myAccount") : t("login")}
        data-track="header.account"
      >
        {connected ? <UserRoundCheckIcon className="size-5" /> : <UserIcon className="size-5" />}
      </Link>
    </Button>
  );
}
