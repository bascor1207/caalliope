"use client";

import { ArrowDownIcon, ArrowUpIcon, Trash2Icon } from "lucide-react";
import { useActionState, useState } from "react";
import { MediaUpload } from "@/components/media-upload";
import {
  type CatalogProduct,
  type ColorSource,
  type Localized,
  PRODUCT_TYPES,
  type ProductData,
  type ProductType,
  slugify,
} from "@/lib/catalog-types";
import { deleteProductAction, saveProductAction } from "../actions";
import { Feedback } from "../catalogue-forms";

const INPUT =
  "mt-1.5 w-full rounded-[12px] border border-line bg-white px-3.5 py-2.5 text-[15px] outline-none focus-visible:border-ink";
const AREA = `${INPUT} min-h-[120px] resize-y`;
const BTN = "rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-ink-2 disabled:opacity-50";
const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "TU"];

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="card">
      <h2 className="text-[19px] font-semibold tracking-[-0.02em]">{title}</h2>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}

function Bilingual({
  label,
  value,
  onChange,
  area,
}: {
  label: string;
  value: Localized;
  onChange: (v: Localized) => void;
  area?: boolean;
}) {
  const Tag = area ? "textarea" : "input";
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {/* biome-ignore lint/a11y/noLabelWithoutControl: le champ (input ou textarea) est bien enfant du label */}
      <label className="text-sm font-semibold">
        {label} (FR)
        <Tag
          value={value.fr}
          onChange={(e) => onChange({ ...value, fr: e.target.value })}
          className={area ? AREA : INPUT}
        />
      </label>
      {/* biome-ignore lint/a11y/noLabelWithoutControl: idem */}
      <label className="text-sm font-semibold">
        {label} (EN)
        <Tag
          value={value.en}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          className={area ? AREA : INPUT}
        />
      </label>
    </div>
  );
}

/** Éditeur complet d'une fiche : textes FR/EN, prix, coloris, tailles, stock, photos. L'état est envoyé en JSON. */
export function ProductEditor({
  product,
  palette,
  storage,
}: {
  product: CatalogProduct;
  palette: ColorSource[];
  storage: boolean;
}) {
  const isNew = product.id === "nouveau";
  const [state, action, pending] = useActionState(saveProductAction.bind(null, product.id), {});
  const [data, setData] = useState<ProductData>(product.data);
  const [slug, setSlug] = useState(product.slug);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [active, setActive] = useState(product.active);
  const patch = (p: Partial<ProductData>) => setData((d) => ({ ...d, ...p }));
  const colorName = (key: string) => palette.find((c) => c.key === key)?.name.fr ?? key;

  const toggleIn = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const sizesOrdered = (list: string[]) => SIZES.filter((s) => list.includes(s));
  const updateImage = (i: number, p: Partial<ProductData["images"][number]>) =>
    patch({ images: data.images.map((img, k) => (k === i ? { ...img, ...p } : img)) });
  const moveImage = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= data.images.length) return;
    const next = [...data.images];
    [next[i], next[j]] = [next[j], next[i]];
    patch({ images: next });
  };

  return (
    <form action={action} className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,.7fr)]">
      <input type="hidden" name="payload" value={JSON.stringify(data)} />
      <input type="hidden" name="sort" value={product.sort} />
      <div className="grid gap-6">
        <Card title="Identité">
          <Bilingual
            label="Nom"
            value={data.name}
            onChange={(name) => {
              patch({ name });
              if (!slugTouched) setSlug(slugify(name.fr));
            }}
          />
          <Bilingual label="Sous-titre" value={data.sub} onChange={(sub) => patch({ sub })} />
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm font-semibold">
              Adresse (slug)
              <input
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
                className={`${INPUT} font-mono`}
              />
              <span className="mt-1 block text-xs font-normal text-muted">/produits/{slugify(slug) || "…"}</span>
            </label>
            <label className="text-sm font-semibold">
              Référence (SKU)
              <input value={data.sku} onChange={(e) => patch({ sku: e.target.value })} className={INPUT} />
            </label>
            <label className="text-sm font-semibold">
              Type
              <select
                value={data.type}
                onChange={(e) => patch({ type: e.target.value as ProductType })}
                className={INPUT}
              >
                {PRODUCT_TYPES.map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Bilingual label="Badge" value={data.badge ?? { fr: "", en: "" }} onChange={(badge) => patch({ badge })} />
        </Card>

        <Card title="Prix" hint="TTC, en euros. Le prix barré affiche une promotion.">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Prix
              <input
                type="number"
                step="0.01"
                min="0"
                value={data.price || ""}
                onChange={(e) => patch({ price: Number(e.target.value) })}
                className={INPUT}
              />
            </label>
            <label className="text-sm font-semibold">
              Prix barré <span className="font-normal text-muted">· facultatif</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={data.compare ?? ""}
                onChange={(e) => patch({ compare: e.target.value ? Number(e.target.value) : undefined })}
                className={INPUT}
              />
            </label>
          </div>
        </Card>

        <Card title="Textes">
          <Bilingual
            label="Description"
            value={data.description}
            onChange={(description) => patch({ description })}
            area
          />
          <Bilingual label="Matière" value={data.material} onChange={(material) => patch({ material })} />
        </Card>

        <Card
          title="Photos"
          hint="La première photo d'un coloris est sa vignette. Lie chaque photo à un coloris pour qu'elle s'affiche quand on le choisit."
        >
          <ul className="grid gap-3">
            {data.images.map((img, i) => (
              <li
                key={img.src}
                className="grid gap-3 rounded-[14px] border border-line p-3 sm:grid-cols-[96px_1fr_auto]"
              >
                <span className="aspect-[4/5] overflow-hidden rounded-[10px] bg-cream-2">
                  {/* biome-ignore lint/performance/noImgElement: fichier externe (Shopify ou Supabase) */}
                  <img src={img.src} alt="" className="h-full w-full object-cover" />
                </span>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold">
                    Coloris
                    <select
                      value={img.colorKey ?? ""}
                      onChange={(e) => updateImage(i, { colorKey: e.target.value || undefined })}
                      className={INPUT}
                    >
                      <option value="">Tous</option>
                      {data.colorKeys.map((k) => (
                        <option key={k} value={k}>
                          {colorName(k)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="text-xs font-semibold text-muted">
                      Texte alternatif (FR)
                      <input
                        value={img.alt.fr}
                        onChange={(e) => updateImage(i, { alt: { ...img.alt, fr: e.target.value } })}
                        className={INPUT}
                      />
                    </label>
                    <label className="text-xs font-semibold text-muted">
                      Texte alternatif (EN)
                      <input
                        value={img.alt.en}
                        onChange={(e) => updateImage(i, { alt: { ...img.alt, en: e.target.value } })}
                        className={INPUT}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex gap-1 sm:flex-col">
                  <button
                    type="button"
                    onClick={() => moveImage(i, -1)}
                    aria-label="Monter"
                    className="grid size-9 place-items-center rounded-full hover:bg-ink/6"
                  >
                    <ArrowUpIcon className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(i, 1)}
                    aria-label="Descendre"
                    className="grid size-9 place-items-center rounded-full hover:bg-ink/6"
                  >
                    <ArrowDownIcon className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => patch({ images: data.images.filter((_, k) => k !== i) })}
                    aria-label="Retirer la photo"
                    className="grid size-9 place-items-center rounded-full text-danger hover:bg-danger/10"
                  >
                    <Trash2Icon className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <MediaUpload
            folder="products"
            accept="image/*"
            label="Ajouter une photo"
            onUploaded={(src) =>
              patch({
                images: [
                  ...data.images,
                  { src, alt: { fr: data.name.fr, en: data.name.en }, colorKey: data.colorKeys[0] },
                ],
              })
            }
          />
          {!storage && (
            <p className="text-xs text-danger">
              Stockage non configuré : SUPABASE_SERVICE_ROLE_KEY manque sur l'admin.
            </p>
          )}
          <p className="text-xs text-muted">
            Format 4:5 conseillé (ex. 1600 × 2000), JPEG ou WebP, moins de 1 Mo par photo.
          </p>
        </Card>
      </div>

      <div className="grid content-start gap-6">
        <Card title="Publication">
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              name="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="size-4 accent-ink"
            />
            En ligne sur la boutique
          </label>
          <button type="submit" disabled={pending} className={BTN}>
            {pending ? "Enregistrement…" : isNew ? "Créer la fiche" : "Enregistrer"}
          </button>
          <Feedback state={state} />
        </Card>

        <Card title="Coloris" hint="Depuis la palette (page Catalogue).">
          <ul className="grid gap-2">
            {palette.map((c) => (
              <li key={c.key}>
                <label className="flex items-center gap-3 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={data.colorKeys.includes(c.key)}
                    onChange={() => patch({ colorKeys: toggleIn(data.colorKeys, c.key) })}
                    className="size-4 accent-ink"
                  />
                  <span
                    className="size-5 rounded-full border border-line"
                    style={{ background: c.hex }}
                    aria-hidden="true"
                  />
                  {c.name.fr}
                </label>
              </li>
            ))}
            {palette.length === 0 && <li className="text-sm text-muted">Aucun coloris : ajoute-en dans la palette.</li>}
          </ul>
        </Card>

        <Card title="Tailles et stock">
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <label
                key={s}
                className={`cursor-pointer rounded-[10px] border-[1.5px] px-3 py-2 text-sm font-semibold ${data.sizes.includes(s) ? "border-ink bg-ink text-cream" : "border-line"}`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={data.sizes.includes(s)}
                  onChange={() => patch({ sizes: sizesOrdered(toggleIn(data.sizes, s)) })}
                />
                {s}
              </label>
            ))}
          </div>
          <fieldset>
            <legend className="text-sm font-semibold">Épuisé (tous coloris)</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.sizes.map((s) => (
                <label key={s} className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={data.soldOut.includes(s)}
                    onChange={() => patch({ soldOut: sizesOrdered(toggleIn(data.soldOut, s)) })}
                    className="size-4 accent-ink"
                  />
                  {s}
                </label>
              ))}
            </div>
          </fieldset>
          {data.colorKeys.map((k) => (
            <fieldset key={k}>
              <legend className="text-sm font-semibold">Épuisé en {colorName(k)}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.sizes.map((s) => {
                  const list = data.soldOutByColor?.[k] ?? [];
                  return (
                    <label key={s} className="flex items-center gap-1.5 text-sm">
                      <input
                        type="checkbox"
                        checked={list.includes(s)}
                        onChange={() =>
                          patch({ soldOutByColor: { ...data.soldOutByColor, [k]: sizesOrdered(toggleIn(list, s)) } })
                        }
                        className="size-4 accent-ink"
                      />
                      {s}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </Card>

        {!isNew && (
          <section className="card border-danger/30">
            <h2 className="text-[19px] font-semibold tracking-[-0.02em]">Supprimer la fiche</h2>
            <p className="mt-1 text-sm text-muted">Définitif. Pour la retirer temporairement, décoche « En ligne ».</p>
            <button
              type="submit"
              formAction={deleteProductAction}
              formNoValidate
              name="id"
              value={product.id}
              onClick={(e) => {
                if (!confirm(`Supprimer « ${data.name.fr} » ?`)) e.preventDefault();
              }}
              className="mt-4 rounded-full border border-danger px-5 py-2.5 text-sm font-semibold text-danger hover:bg-danger/10"
            >
              Supprimer
            </button>
          </section>
        )}
      </div>
    </form>
  );
}
