"use client";

import { useState } from "react";
import type { AuthFeatures } from "@/slices/auth/public-types";
import { LoginDialog, useSession } from "@/slices/auth/public-ui";
import { ExpressCheckout } from "@/slices/checkout/public-ui";

/**
 * Composition : l'achat express (checkout) exige un compte ; la connexion se fait dans une modale (auth)
 * sans quitter la fiche. Les deux slices ne se connaissent pas.
 */
export function ExpressPurchase({ publishableKey, features }: { publishableKey: string; features: AuthFeatures }) {
  const session = useSession();
  const [login, setLogin] = useState(false);
  return (
    <>
      <ExpressCheckout publishableKey={publishableKey} session={session.status} onSignIn={() => setLogin(true)} />
      <LoginDialog
        open={login}
        onOpenChange={setLogin}
        features={features}
        next={typeof window === "undefined" ? undefined : `${window.location.pathname}${window.location.search}`}
      />
    </>
  );
}
