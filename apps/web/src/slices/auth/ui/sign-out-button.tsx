"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button, startNavigation } from "@/shared/ui";
import { sessionActions } from "./session-store";

export function SignOutButton() {
  const t = useTranslations("auth");
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={async () => {
        await sessionActions.signOut();
        startNavigation();
        router.push("/");
        router.refresh();
      }}
      data-track="auth.logout"
    >
      {t("logout")}
    </Button>
  );
}
