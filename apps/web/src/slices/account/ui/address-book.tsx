"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useOptimistic, useState, useTransition } from "react";
import { eventBus } from "@/shared/event-bus";
import { formatPhone, normalizePhone } from "@/shared/kernel/phone";
import { Button, Input, Label, PhoneInput } from "@/shared/ui";
import {
  ADDRESS_FIELDS,
  type Address,
  type AddressErrors,
  type AddressField,
  type AddressInput,
  addressLines,
  validateAddress,
} from "../domain/address";
import { deleteAddressAction, saveAddressAction, setDefaultAddressAction } from "../infrastructure/actions";

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

const fromForm = (f: FormData): AddressInput => {
  const input = Object.fromEntries(ADDRESS_FIELDS.map((k) => [k, String(f.get(k) ?? "").trim()])) as AddressInput;
  if (!input.country) input.country = "France";
  input.phone = normalizePhone(input.phone);
  return input;
};

/** Formulaire sans état serveur : il remet la saisie au parent, qui décide à l'instant. */
function AddressForm({
  initial,
  errors,
  title,
  onCancel,
  onSubmit,
}: {
  initial: Partial<AddressInput>;
  errors: AddressErrors;
  title: string;
  onCancel: () => void;
  onSubmit: (input: AddressInput) => void;
}) {
  const t = useTranslations("account");
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(fromForm(new FormData(e.currentTarget)));
      }}
      className="grid gap-3 rounded-card border border-ink/20 bg-white p-5 sm:grid-cols-2 md:p-6"
    >
      <p className="eyebrow sm:col-span-2">{title}</p>
      {FIELDS.map((f) => (
        <Label key={f.name} className={f.full ? "sm:col-span-2" : undefined}>
          <span>
            {t(`fields.${f.name}`)}
            {f.optional && <span className="font-normal text-muted"> · {t("optional")}</span>}
          </span>
          {f.name === "phone" ? (
            <PhoneInput name="phone" defaultValue={initial.phone ?? ""} aria-invalid={!!errors.phone} />
          ) : (
            <Input
              name={f.name}
              autoComplete={f.autoComplete}
              defaultValue={initial[f.name] ?? (f.name === "country" ? "France" : "")}
              inputMode={f.name === "zip" ? "numeric" : undefined}
              placeholder={f.name === "label" ? t("labelPlaceholder") : undefined}
              aria-invalid={!!errors[f.name]}
            />
          )}
          {errors[f.name] && <span className="text-xs text-danger">{t(`errors.${errors[f.name] ?? "required"}`)}</span>}
        </Label>
      ))}
      <div className="flex flex-wrap items-center gap-2.5 sm:col-span-2">
        <Button type="submit">{t("save")}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}

type Patch = { type: "upsert"; address: Address } | { type: "remove"; id: string } | { type: "default"; id: string };

const applyPatch = (list: Address[], patch: Patch): Address[] => {
  if (patch.type === "remove") return list.filter((a) => a.id !== patch.id);
  if (patch.type === "default") return list.map((a) => ({ ...a, isDefault: a.id === patch.id }));
  const exists = list.some((a) => a.id === patch.address.id);
  const next = exists ? list.map((a) => (a.id === patch.address.id ? patch.address : a)) : [...list, patch.address];
  return next.length === 1 ? next.map((a) => ({ ...a, isDefault: true })) : next;
};

/**
 * Carnet d'adresses à zéro latence : chaque action s'applique immédiatement dans la liste (useOptimistic),
 * le formulaire se referme sur-le-champ, le serveur confirme en arrière-plan. En cas de refus,
 * la liste revient en arrière, un toast l'explique et le formulaire se rouvre avec la saisie.
 */
export function AddressBook({ addresses: server }: { addresses: Address[] }) {
  const t = useTranslations("account");
  const [addresses, patch] = useOptimistic(server, applyPatch);
  const [, start] = useTransition();
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Partial<AddressInput>>({});
  const [errors, setErrors] = useState<AddressErrors>({});

  const open = (id: string | "new", initial: Partial<AddressInput> = {}, errs: AddressErrors = {}) => {
    setDraft(initial);
    setErrors(errs);
    setEditing(id);
  };
  const close = () => {
    setEditing(null);
    setDraft({});
    setErrors({});
  };
  const fail = () => eventBus.publish("ui.notify", { text: t("notSaved"), tone: "error" });
  const done = (text: string) => eventBus.publish("ui.notify", { text, tone: "success" });
  const form = (fields: Record<string, string>) => {
    const f = new FormData();
    for (const [k, v] of Object.entries(fields)) f.set(k, v);
    return f;
  };

  const submit = (input: AddressInput) => {
    const id = editing === "new" || editing === null ? undefined : editing;
    const local = validateAddress(input);
    if (Object.keys(local).length > 0) {
      setErrors(local);
      return;
    }
    const current = id ? addresses.find((a) => a.id === id) : undefined;
    close();
    start(async () => {
      patch({
        type: "upsert",
        address: { ...input, id: id ?? `tmp-${Date.now()}`, isDefault: current?.isDefault ?? false },
      });
      try {
        const r = await saveAddressAction({}, form({ ...input, id: id ?? "" }));
        if (r.errors || r.denied) {
          fail();
          open(id ?? "new", input, r.errors ?? {});
          return;
        }
        done(t("saved"));
      } catch {
        fail();
        open(id ?? "new", input);
      }
    });
  };
  const run = (p: Patch, work: () => Promise<void>, text: string) =>
    start(async () => {
      patch(p);
      try {
        await work();
        done(text);
      } catch {
        fail();
      }
    });

  return (
    <div className="grid gap-3">
      {addresses.length === 0 && editing !== "new" && (
        <p className="rounded-card border border-line bg-white p-6 text-sm text-muted">{t("noAddress")}</p>
      )}
      <ul className="grid gap-3 sm:grid-cols-2">
        {addresses.map((a) =>
          editing === a.id ? (
            <li key={a.id} className="sm:col-span-2">
              <AddressForm
                initial={draft}
                errors={errors}
                title={t("editAddress")}
                onCancel={close}
                onSubmit={submit}
              />
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
                {addressLines({ ...a, phone: formatPhone(a.phone) }).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                <button type="button" className="underline underline-offset-[3px]" onClick={() => open(a.id, a)}>
                  {t("edit")}
                </button>
                {!a.isDefault && (
                  <button
                    type="button"
                    className="underline underline-offset-[3px]"
                    onClick={() =>
                      run(
                        { type: "default", id: a.id },
                        () => setDefaultAddressAction(form({ id: a.id })),
                        t("defaultSet"),
                      )
                    }
                  >
                    {t("makeDefault")}
                  </button>
                )}
                <button
                  type="button"
                  className="text-danger underline underline-offset-[3px]"
                  onClick={() =>
                    run({ type: "remove", id: a.id }, () => deleteAddressAction(form({ id: a.id })), t("removed"))
                  }
                >
                  {t("remove")}
                </button>
              </div>
            </li>
          ),
        )}
      </ul>
      {editing === "new" ? (
        <AddressForm initial={draft} errors={errors} title={t("newAddress")} onCancel={close} onSubmit={submit} />
      ) : (
        <div>
          <Button type="button" variant="ghost" onClick={() => open("new")}>
            <PlusIcon className="size-4" aria-hidden="true" />
            {t("addAddress")}
          </Button>
        </div>
      )}
    </div>
  );
}
