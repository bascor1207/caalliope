import { getTranslations } from "next-intl/server";
import { displayName, type SessionUser } from "../domain/user";
import { SignOutButton } from "./sign-out-button";

/** En-tête de la page compte : identité, rôle, déconnexion. */
export async function AccountHeader({ user }: { user: SessionUser }) {
  const t = await getTranslations("auth");
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-2 text-[clamp(30px,5vw,56px)] tracking-[-0.03em]">
          {t("hello")} <span className="serif">{displayName(user)}</span>
        </h1>
        <p className="mt-2 text-sm text-muted">
          {user.email}
          {user.role === "admin" ? ` · ${t("adminBadge")}` : ""}
        </p>
      </div>
      <SignOutButton />
    </div>
  );
}
