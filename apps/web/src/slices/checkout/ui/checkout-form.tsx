"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { eventBus } from "@/shared/event-bus";
import type { Locale } from "@/shared/kernel/locale";
import { Button, Input, Label, ProductArt, RadioCard, RadioGroup, startNavigation, useMoney } from "@/shared/ui";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { checkoutReset, selectCheckoutErrors, selectCheckoutStatus, submitOrder } from "../application/checkout.slice";
import {
  type Customer,
  type CustomerField,
  hasErrors,
  PAYMENT_METHODS,
  type PaymentMethod,
  type ValidationErrors,
  validateCustomer,
} from "../domain/order";

/** Vue d'une ligne à commander : fournie par la page (qui la projette depuis le panier). */
export interface CheckoutLineView {
  productId: string;
  colorKey: string;
  size: string;
  qty: number;
  name: string;
  productType: string;
  colorName: string;
  colorHex: string;
  imageSrc?: string;
  unitPrice: number;
}

interface Props {
  lines: CheckoutLineView[];
  totals: { subtotal: number; shipping: number; total: number };
}

const FIELDS: Array<{
  name: Exclude<CustomerField, "email">;
  autoComplete: string;
  full?: boolean;
  inputMode?: "numeric";
}> = [
  { name: "firstName", autoComplete: "given-name" },
  { name: "lastName", autoComplete: "family-name" },
  { name: "address", autoComplete: "street-address", full: true },
  { name: "zip", autoComplete: "postal-code", inputMode: "numeric" },
  { name: "city", autoComplete: "address-level2" },
];

export function CheckoutForm({ lines, totals }: Props) {
  const t = useTranslations("checkout.form");
  const tc = useTranslations("common");
  const money = useMoney();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectCheckoutStatus);
  const serverErrors = useAppSelector(selectCheckoutErrors);
  const [localErrors, setLocalErrors] = useState<ValidationErrors>({});
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const errors = { ...serverErrors, ...localErrors };

  useEffect(() => () => void dispatch(checkoutReset()), [dispatch]);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: un seul fait "commande démarrée" par affichage du formulaire.
  useEffect(() => {
    if (count > 0) eventBus.publish("checkout.started", { count, total: totals.total });
  }, []);

  const submit = async (formData: FormData) => {
    const customer = Object.fromEntries(
      (["email", "firstName", "lastName", "address", "zip", "city"] as const).map((k) => [
        k,
        String(formData.get(k) ?? "").trim(),
      ]),
    ) as unknown as Customer;
    const local = validateCustomer(customer);
    setLocalErrors(local);
    if (hasErrors(local)) {
      // Friction mesurable : un formulaire refusé avant même l'envoi.
      for (const code of Object.values(local)) if (code) eventBus.publish("checkout.failed", { code });
      return;
    }
    const result = await dispatch(
      submitOrder({
        locale,
        customer,
        payment,
        lines: lines.map(({ productId, colorKey, size, qty }) => ({ productId, colorKey, size, qty })),
      }),
    );
    if (submitOrder.fulfilled.match(result)) {
      const order = result.payload;
      startNavigation();
      router.push({
        pathname: "/commande/confirmation",
        query: { ref: order.ref, prenom: customer.firstName, email: customer.email, total: String(order.total) },
      });
    }
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[760px] py-12 text-center">
        <p className="eyebrow">{tc("labels.preorder")}</p>
        <h1 className="my-3 text-[clamp(36px,5.5vw,64px)] tracking-[-0.04em]">
          {t("emptyTitle")} <span className="serif">{t("emptySerif")}</span>
        </h1>
        <Button asChild>
          <Link href={{ pathname: "/", hash: "drop" }}>{tc("actions.seeDrop")}</Link>
        </Button>
      </div>
    );
  }

  const fieldError = (field: CustomerField | "cart") => {
    const code = errors[field];
    return code ? <span className="text-xs text-danger">{t(`errors.${code}`)}</span> : null;
  };

  return (
    <div className="grid overflow-hidden rounded-card border border-line bg-cream md:grid-cols-[1.15fr_.85fr]">
      <div className="p-6 md:px-8 md:py-9">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-2 text-[30px] tracking-[-0.03em]">{t("title")}</h1>
        <form
          action={submit}
          noValidate
          className="mt-6 grid gap-6"
          onInput={(e) => {
            const name = (e.target as HTMLInputElement).name as CustomerField;
            if (localErrors[name]) setLocalErrors(({ [name]: _cleared, ...rest }) => rest);
          }}
        >
          <fieldset className="grid gap-3">
            <legend className="eyebrow mb-2.5">{t("contact")}</legend>
            <Label>
              {t("email")}
              <Input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t("emailPlaceholder")}
                aria-invalid={!!errors.email}
              />
              {fieldError("email")}
            </Label>
          </fieldset>
          <fieldset className="grid gap-3">
            <legend className="eyebrow mb-2.5">{t("shipping")}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {FIELDS.map((f) => (
                <Label key={f.name} className={f.full ? "sm:col-span-2" : undefined}>
                  {t(f.name)}
                  <Input
                    name={f.name}
                    autoComplete={f.autoComplete}
                    inputMode={f.inputMode}
                    placeholder={f.name === "address" ? t("addressPlaceholder") : undefined}
                    required
                    aria-invalid={!!errors[f.name]}
                  />
                  {fieldError(f.name)}
                </Label>
              ))}
            </div>
          </fieldset>
          <fieldset className="grid gap-3">
            <legend className="eyebrow mb-2.5">{t("payment")}</legend>
            <RadioGroup value={payment} onValueChange={(v) => setPayment(v as PaymentMethod)} aria-label={t("payment")}>
              {PAYMENT_METHODS.map((m) => (
                <RadioCard key={m} value={m}>
                  {t(m)}
                </RadioCard>
              ))}
            </RadioGroup>
            <p className="text-xs text-muted">{t("pocNote")}</p>
          </fieldset>
          {errors.cart && (
            <p className="text-xs text-danger" role="alert">
              {t(`errors.${errors.cart}`)}
            </p>
          )}
          <Button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? t("submitting") : t("pay", { total: money(totals.total) })}
          </Button>
          <p className="text-center text-xs text-muted">
            {t.rich("terms", {
              link: (c) => (
                <Link className="underline underline-offset-[3px]" href="/cgv">
                  {c}
                </Link>
              ),
            })}
          </p>
        </form>
      </div>
      <aside className="-order-1 border-b border-line bg-cream-2 p-6 md:order-none md:border-b-0 md:border-l md:px-7 md:py-9">
        <h2 className="mb-3.5 text-base">{t("summary")}</h2>
        {lines.map((l) => (
          <div
            key={`${l.productId}-${l.colorKey}-${l.size}`}
            className="grid grid-cols-[44px_1fr_auto] items-center gap-3 border-b border-line py-2.5 text-[13px]"
          >
            <span
              className="relative grid aspect-[4/5] w-11 place-items-center overflow-hidden rounded-lg"
              style={{ background: l.colorHex }}
            >
              {l.imageSrc ? (
                <Image src={l.imageSrc} alt="" fill sizes="44px" className="object-cover" />
              ) : (
                <ProductArt kind={l.productType} color={l.colorHex} className="w-[60%]" />
              )}
            </span>
            <span>
              <b>{l.name}</b>
              <small className="block text-muted">
                {l.colorName} · {l.size} · × {l.qty}
              </small>
            </span>
            <span>{money(l.unitPrice * l.qty)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 text-sm text-ink-2">
          <span>{t("subtotal")}</span>
          <span>{money(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between pt-3 text-sm text-ink-2">
          <span>{t("shippingLine")}</span>
          <span>{totals.shipping ? money(totals.shipping) : tc("labels.free")}</span>
        </div>
        <div className="mt-3 flex justify-between border-t border-line pt-4 font-display text-lg font-bold">
          <span>{t("total")}</span>
          <span>{money(totals.total)}</span>
        </div>
      </aside>
    </div>
  );
}
