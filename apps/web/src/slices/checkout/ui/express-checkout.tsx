"use client";

import { Elements, ExpressCheckoutElement, useElements, useStripe } from "@stripe/react-stripe-js";
import {
  loadStripe,
  type StripeExpressCheckoutElementClickEvent,
  type StripeExpressCheckoutElementConfirmEvent,
} from "@stripe/stripe-js";
import { LockIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { eventBus } from "@/shared/event-bus";
import { useBusEvent } from "@/shared/event-bus/use-bus-event";
import type { Locale } from "@/shared/kernel/locale";
import { type Totals, totalsFor } from "@/shared/kernel/shipping-policy";
import { Skeleton, startNavigation } from "@/shared/ui";
import { toCents } from "../application/express-checkout";
import type { Customer, ErrorCode, OrderLineInput } from "../domain/order";
import { completeExpressOrderAction, prepareExpressPaymentAction } from "../infrastructure/express-checkout.action";

interface Selection {
  productId: string;
  name: string;
  colorKey: string;
  colorName: string;
  size: string | null;
  unitPrice: number;
}

/**
 * Achat express depuis la fiche produit : Apple Pay, Google Pay ou Link via Stripe (Express Checkout Element).
 * Suit la sélection (coloris, taille) publiée par le configurateur ; le montant affiché vient de la même règle
 * de livraison que le panier, et le serveur le recalcule avant de créer le paiement.
 * Mode test Stripe (clés `pk_test_` / `sk_test_`) : aucun débit réel.
 */
export type ExpressSession = "loading" | "anonymous" | "authenticated";

interface ExpressProps {
  publishableKey: string;
  /** État de session fourni par la composition root : l'achat express exige un compte (trace de la commande). */
  session: ExpressSession;
  /** Ouvre la connexion (modale composée par la page) sans quitter la fiche. */
  onSignIn: () => void;
}

export function ExpressCheckout({ publishableKey, session, onSignIn }: ExpressProps) {
  const locale = useLocale() as Locale;
  const [selection, setSelection] = useState<Selection | null>(null);
  useBusEvent("catalog.selection-changed", setSelection);
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);
  if (!selection) return null;
  const totals = totalsFor([{ qty: 1, unitPrice: selection.unitPrice }]);
  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: toCents(totals.total),
        currency: "eur",
        locale,
        appearance: { variables: { borderRadius: "14px" } },
      }}
    >
      <ExpressButtons selection={selection} totals={totals} locale={locale} session={session} onSignIn={onSignIn} />
    </Elements>
  );
}

/** Nom et adresse de livraison renvoyés par le portefeuille → client de la commande. */
export function customerFromWallet(event: {
  billingDetails?: { name: string; email?: string };
  shippingAddress?: {
    name: string;
    address: { line1?: string | null; line2?: string | null; city: string; postal_code: string };
  };
}): Customer {
  const name = (event.shippingAddress?.name || event.billingDetails?.name || "").trim();
  const [firstName = "", ...rest] = name.split(/\s+/);
  const address = event.shippingAddress?.address;
  return {
    email: event.billingDetails?.email?.trim() ?? "",
    firstName,
    lastName: rest.join(" ") || firstName,
    address: [address?.line1, address?.line2].filter(Boolean).join(", "),
    zip: address?.postal_code ?? "",
    city: address?.city ?? "",
  };
}

function ExpressButtons({
  selection,
  totals,
  locale,
  session,
  onSignIn,
}: {
  selection: Selection;
  totals: Totals;
  locale: Locale;
  session: ExpressSession;
  onSignIn: () => void;
}) {
  const t = useTranslations("checkout.express");
  const tErrors = useTranslations("checkout.form.errors");
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  /** loading : Stripe se charge (squelette) ; ready : au moins un portefeuille ; none : rien à proposer. */
  const [state, setState] = useState<"loading" | "ready" | "none">("loading");
  const available = state === "ready";
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  /** Diagnostic (`?debug` dans l'URL) : état du composant Stripe et portefeuilles détectés. */
  const [diag, setDiag] = useState("chargement…");
  const [caught, setCaught] = useState<string[]>([]);
  const debug = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("debug");

  /* Sans réponse de Stripe après 10 s (script bloqué…), on replie le squelette plutôt que de le laisser tourner. */
  useEffect(() => {
    if (state !== "loading") return;
    const timer = window.setTimeout(() => setState((s) => (s === "loading" ? "none" : s)), 10_000);
    return () => window.clearTimeout(timer);
  }, [state]);

  /* Diagnostic : on capte les erreurs (console, exceptions, promesses) pendant que Stripe se charge. */
  useEffect(() => {
    if (!debug) return;
    const push = (m: string) => setCaught((l) => [...l.slice(-5), m.slice(0, 220)]);
    const original = console.error;
    console.error = (...args: unknown[]) => {
      push(`console: ${args.map((a) => (a instanceof Error ? a.message : String(a))).join(" ")}`);
      original(...args);
    };
    const onError = (e: ErrorEvent) => push(`error: ${e.message}`);
    const onRejection = (e: PromiseRejectionEvent) =>
      push(`promise: ${e.reason instanceof Error ? e.reason.message : String(e.reason)}`);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      console.error = original;
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [debug]);
  const shippingRate = {
    id: "standard",
    amount: toCents(totals.shipping),
    displayName: totals.shipping === 0 ? t("shippingFree") : t("shipping"),
    deliveryEstimate: {
      minimum: { unit: "business_day" as const, value: 2 },
      maximum: { unit: "business_day" as const, value: 5 },
    },
  };

  const onClick = (event: StripeExpressCheckoutElementClickEvent) => {
    if (session !== "authenticated") return;
    if (!selection.size) {
      setError(t("chooseSize"));
      return;
    }
    setError(null);
    event.resolve({
      lineItems: [
        {
          name: `${selection.name} · ${selection.colorName} · ${selection.size}`,
          amount: toCents(selection.unitPrice),
        },
      ],
      shippingRates: [shippingRate],
    });
  };

  const fail = (message: string) => {
    setError(message);
    setBusy(false);
  };

  const onConfirm = async (event: StripeExpressCheckoutElementConfirmEvent) => {
    if (!stripe || !elements || !selection.size) return;
    setBusy(true);
    setError(null);
    const line: OrderLineInput = {
      productId: selection.productId,
      colorKey: selection.colorKey,
      size: selection.size,
      qty: 1,
    };
    const { error: submitError } = await elements.submit();
    if (submitError) return fail(submitError.message ?? t("failed"));
    const prepared = await prepareExpressPaymentAction({ locale, line });
    if (!prepared.ok) {
      event.paymentFailed({ reason: "fail" });
      return fail(tErrors(prepared.code));
    }
    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret: prepared.clientSecret,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });
    if (confirmError) return fail(confirmError.message ?? t("failed"));
    const intentId = paymentIntent?.id ?? prepared.intentId;
    const customer = customerFromWallet(event);
    const result = await completeExpressOrderAction({ locale, intentId, line, customer });
    if (!result.ok) {
      const code: ErrorCode = result.errors.cart ?? "network";
      return fail(code === "payment-failed" ? tErrors(code) : t("paidButFailed", { ref: intentId }));
    }
    eventBus.publish("checkout.order-placed", {
      ref: result.order.ref,
      total: result.order.total,
      subtotal: result.order.subtotal,
      shipping: result.order.shipping,
      discount: 0,
      email: customer.email,
      items: result.order.lines.map((l) => ({
        productId: l.productId,
        colorKey: l.colorKey,
        size: l.size,
        qty: l.qty,
        price: l.unitPrice,
      })),
      express: true,
    });
    startNavigation();
    router.push({
      pathname: "/commande/confirmation",
      query: {
        ref: result.order.ref,
        prenom: customer.firstName,
        email: customer.email,
        total: String(result.order.total),
      },
    });
  };

  return (
    <div className={state === "none" ? "h-0 overflow-hidden" : "grid gap-2"} aria-busy={busy} data-express={state}>
      {state !== "none" && (
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.1em] text-muted before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
          {t("title")}
        </p>
      )}
      <div className="relative min-h-12">
        {state === "ready" && session === "anonymous" && (
          <button
            type="button"
            onClick={onSignIn}
            className="absolute inset-0 z-10 flex items-center justify-center gap-2.5 rounded-[14px] bg-cream/85 px-4 text-center text-sm font-semibold backdrop-blur-[3px] transition-colors hover:bg-cream/95"
            data-track="express.sign-in"
          >
            <LockIcon className="size-4 shrink-0" aria-hidden="true" />
            {t("signIn")}
          </button>
        )}
        {(state === "loading" || session === "loading") && (
          <div className="absolute inset-0 grid gap-2" aria-hidden="true">
            <Skeleton className="h-12 rounded-[14px]" />
          </div>
        )}
        <ExpressCheckoutElement
          options={{
            buttonType: { applePay: "buy", googlePay: "buy" },
            buttonHeight: 48,
            layout: { maxColumns: 1, maxRows: 2, overflow: "auto" },
            paymentMethods: { paypal: "never", amazonPay: "never", klarna: "never" },
            emailRequired: true,
            shippingAddressRequired: true,
            allowedShippingCountries: ["FR"],
            shippingRates: [shippingRate],
          }}
          onReady={(e) => {
            setState(e.availablePaymentMethods ? "ready" : "none");
            setDiag(
              e.availablePaymentMethods
                ? `prêt · ${Object.entries(e.availablePaymentMethods)
                    .filter(([, on]) => on)
                    .map(([k]) => k)
                    .join(", ")}`
                : "prêt · aucun portefeuille disponible dans ce navigateur",
            );
          }}
          onLoadError={(e) => {
            setState("none");
            setDiag(`erreur de chargement · ${e.error?.message ?? "inconnue"}`);
          }}
          onClick={onClick}
          onConfirm={onConfirm}
          onShippingAddressChange={(e) => e.resolve({ shippingRates: [shippingRate] })}
          onShippingRateChange={(e) => e.resolve()}
          onCancel={() => setBusy(false)}
        />
      </div>
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
      {available && <p className="text-xs text-muted">{session === "anonymous" ? t("signInHint") : t("hint")}</p>}
      {debug && (
        <div className="grid gap-1 rounded-[10px] bg-sand px-3 py-2 font-mono text-xs text-ink-2">
          <p>
            stripe express · {diag} · stripe {stripe ? "ok" : "en attente"} · elements {elements ? "ok" : "en attente"}{" "}
            · {navigator.userAgent.slice(0, 90)}
          </p>
          {caught.map((m) => (
            <p key={m}>{m}</p>
          ))}
        </div>
      )}
    </div>
  );
}
