"use client";

import { Elements, ExpressCheckoutElement, useElements, useStripe } from "@stripe/react-stripe-js";
import {
  loadStripe,
  type StripeExpressCheckoutElementClickEvent,
  type StripeExpressCheckoutElementConfirmEvent,
} from "@stripe/stripe-js";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { eventBus } from "@/shared/event-bus";
import { useBusEvent } from "@/shared/event-bus/use-bus-event";
import type { Locale } from "@/shared/kernel/locale";
import { type Totals, totalsFor } from "@/shared/kernel/shipping-policy";
import { startNavigation } from "@/shared/ui";
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
export function ExpressCheckout({ publishableKey }: { publishableKey: string }) {
  const locale = useLocale() as Locale;
  const [selection, setSelection] = useState<Selection | null>(null);
  useBusEvent("catalog.selection-changed", setSelection);
  const stripePromise = useMemo(() => loadStripe(publishableKey, { locale }), [publishableKey, locale]);
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
        appearance: { variables: { borderRadius: "14px", fontFamily: "inherit" } },
      }}
    >
      <ExpressButtons selection={selection} totals={totals} locale={locale} />
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

function ExpressButtons({ selection, totals, locale }: { selection: Selection; totals: Totals; locale: Locale }) {
  const t = useTranslations("checkout.express");
  const tErrors = useTranslations("checkout.form.errors");
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [available, setAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  /** Diagnostic (`?debug` dans l'URL) : état du composant Stripe et portefeuilles détectés. */
  const [diag, setDiag] = useState("chargement…");
  const debug = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("debug");
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
      email: customer.email,
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
    <div className="grid gap-2" aria-busy={busy} data-express={available ? "ready" : "none"}>
      {available && (
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.1em] text-muted before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
          {t("title")}
        </p>
      )}
      <ExpressCheckoutElement
        options={{
          buttonType: { applePay: "buy", googlePay: "buy" },
          buttonHeight: 48,
          layout: { maxColumns: 1, maxRows: 2, overflow: "never" },
          paymentMethods: { paypal: "never", amazonPay: "never", klarna: "never" },
          emailRequired: true,
          shippingAddressRequired: true,
          allowedShippingCountries: ["FR"],
          shippingRates: [shippingRate],
        }}
        onReady={(e) => {
          setAvailable(Boolean(e.availablePaymentMethods));
          setDiag(
            e.availablePaymentMethods
              ? `prêt · ${Object.entries(e.availablePaymentMethods)
                  .filter(([, on]) => on)
                  .map(([k]) => k)
                  .join(", ")}`
              : "prêt · aucun portefeuille disponible dans ce navigateur",
          );
        }}
        onLoadError={(e) => setDiag(`erreur de chargement · ${e.error?.message ?? "inconnue"}`)}
        onClick={onClick}
        onConfirm={onConfirm}
        onShippingAddressChange={(e) => e.resolve({ shippingRates: [shippingRate] })}
        onShippingRateChange={(e) => e.resolve()}
        onCancel={() => setBusy(false)}
      />
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
      {available && <p className="text-xs text-muted">{t("hint")}</p>}
      {debug && (
        <p className="rounded-[10px] bg-sand px-3 py-2 font-mono text-xs text-ink-2">
          stripe express · {diag} · {navigator.userAgent.slice(0, 90)}
        </p>
      )}
    </div>
  );
}
