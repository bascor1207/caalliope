"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { Button, Input, Label } from "@/shared/ui";
import { type Address, type AddressField, addressLines } from "../domain/address";
import {
  type AddressState,
  deleteAddressAction,
  saveAddressAction,
  setDefaultAddressAction,
} from "../infrastructure/actions";

const FIELDS: Array<{ name: AddressField; autoComplete: string; full?: boolean; optional?: boolean }> = [
  { name: "label", autoComplete: "off", full: true, optional: true },
  { name: "firstName", autoComplete: "given-name" },
  { name: "lastName", autoComplete: "family-name" },
  { name: "line1", autoComplete: "address-line1", full: true },
  { name: "line2", autoComplete: "address-line2", full: true, optional: true },
  { name: "zip", autoComplete: "postal-code" },
  { name: "city", autoComplete: "address-level2" },
  { name: "country", autoComplete: "country-name" },
  { name: "phone", autoComplete: "tel", optional: true },
];

function AddressForm({ address, onDone }: { address?: Address; onDone: () => void }) {
  const t = useTranslations("account");
  const [state, action, pending] = useActionState<AddressState, FormData>(saveAddressAction, {});
  useEffect(() => {
    if (state.ok) onDone();
  }, [state.ok, onDone]);
  return (
    <form
      action={action}
      noValidate
      className="grid gap-3 rounded-card border border-ink/20 bg-white p-5 sm:grid-cols-2 md:p-6"
    >
      {address && <input type="hidden" name="id" value={address.id} />}
      <p className="eyebrow sm:col-span-2">{address ? t("editAddress") : t("newAddress")}</p>
      {FIELDS.map((f) => (
        <Label key={f.name} className={f.full ? "sm:col-span-2" : undefined}>
          {t(`fields.${f.name}`)}
          {f.optional && <span className="font-normal text-muted"> · {t("optional")}</span>}
          <Input
            name={f.name}
            autoComplete={f.autoComplete}
            defaultValue={address?.[f.name] ?? (f.name === "country" ? "France" : "")}
            inputMode={f.name === "zip" ? "numeric" : undefined}
            type={f.name === "phone" ? "tel" : "text"}
            placeholder={f.name === "label" ? t("labelPlaceholder") : undefined}
            aria-invalid={!!state.errors?.[f.name]}
          />
          {state.errors?.[f.name] && (
            <span className="text-xs text-danger">{t(`errors.${state.errors[f.name] ?? "required"}`)}</span>
          )}
        </Label>
      ))}
      <div className="flex flex-wrap items-center gap-2.5 sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? t("saving") : t("save")}
        </Button>
        <Button type="button" variant="ghost" onClick={onDone}>
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}

/** Carnet d'adresses : liste, adresse par défaut, ajout, modification, suppression. */
export function AddressBook({ addresses }: { addresses: Address[] }) {
  const t = useTranslations("account");
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const close = () => setEditing(null);
  return (
    <div className="grid gap-3">
      {addresses.length === 0 && editing !== "new" && (
        <p className="rounded-card border border-line bg-white p-6 text-sm text-muted">{t("noAddress")}</p>
      )}
      <ul className="grid gap-3 sm:grid-cols-2">
        {addresses.map((a) =>
          editing === a.id ? (
            <li key={a.id} className="sm:col-span-2">
              <AddressForm address={a} onDone={close} />
            </li>
          ) : (
            <li key={a.id} className="flex flex-col rounded-card border border-line bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <b className="font-display text-base">{a.label || t("fields.address")}</b>
                {a.isDefault && (
                  <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                    {t("default")}
                  </span>
                )}
              </div>
              <address className="mt-2 text-sm text-ink-2 not-italic">
                {addressLines(a).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                <button type="button" className="underline underline-offset-[3px]" onClick={() => setEditing(a.id)}>
                  {t("edit")}
                </button>
                {!a.isDefault && (
                  <form action={setDefaultAddressAction}>
                    <input type="hidden" name="id" value={a.id} />
                    <button type="submit" className="underline underline-offset-[3px]">
                      {t("makeDefault")}
                    </button>
                  </form>
                )}
                <form action={deleteAddressAction}>
                  <input type="hidden" name="id" value={a.id} />
                  <button type="submit" className="text-danger underline underline-offset-[3px]">
                    {t("remove")}
                  </button>
                </form>
              </div>
            </li>
          ),
        )}
      </ul>
      {editing === "new" ? (
        <AddressForm onDone={close} />
      ) : (
        <div>
          <Button type="button" variant="ghost" onClick={() => setEditing("new")}>
            <PlusIcon className="size-4" aria-hidden="true" />
            {t("addAddress")}
          </Button>
        </div>
      )}
    </div>
  );
}
