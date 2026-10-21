import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { z } from "zod";
import { isPeriod, loadSummary, type Period } from "@/lib/analytics";
import {
  deleteCatalogProduct,
  getCatalogProduct,
  getPalette,
  listCatalog,
  saveCatalogProduct,
  savePalette,
  setProductActive,
  slugTaken,
} from "@/lib/catalog";
import { emptyProduct, type ProductData, slugify, validateProduct } from "@/lib/catalog-types";
import { getAnnouncement, getBanners, getMedia, saveAnnouncement, saveBanners, saveMedia } from "@/lib/marketing";
import {
  createCampaign,
  getCampaign,
  listCampaigns,
  listSubscribers,
  sendCampaign,
  sendTest,
  subscriberStats,
  updateCampaign,
} from "@/lib/newsletter";
import { getSocialSettings, revalidateShop, SOCIAL_KEY, setSetting } from "@/lib/settings";
import { createUploadTicket, storageConfigured } from "@/lib/storage";
import { listFlags, listUsers, setFlag } from "@/lib/users";

/** Les envois de campagne peuvent durer : on laisse une minute à la fonction. */
export const maxDuration = 60;

const json = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });
const localized = z.object({ fr: z.string(), en: z.string() });

/**
 * Serveur MCP de l'admin : une IA (Claude, Cursor, ChatGPT…) pilote le back-office avec les mêmes règles
 * que l'interface : catalogue, marketing, newsletter, réglages, statistiques, envoi de médias.
 * Authentification : en-tête `Authorization: Bearer <MCP_TOKEN>`.
 */
const handler = createMcpHandler(
  (server) => {
    /* ---------- Statistiques ---------- */
    server.registerTool(
      "get_analytics",
      {
        title: "Statistiques de la boutique",
        description:
          "Synthèse d'audience et de ventes sur 7, 30 ou 90 jours : visites, pages vues, parcours d'achat (visites distinctes par étape), produits, clics, frictions, chiffre d'affaires.",
        inputSchema: z.object({ days: z.number().int().optional().describe("7, 30 ou 90 (défaut 30)") }),
      },
      async ({ days }) => json(await loadSummary(isPeriod(days) ? (days as Period) : 30)),
    );

    /* ---------- Catalogue ---------- */
    server.registerTool(
      "list_products",
      {
        title: "Lister les fiches produit",
        description:
          "Toutes les fiches (en ligne ou non) avec leur contenu FR/EN, prix, coloris, tailles, stock et photos.",
        inputSchema: z.object({}),
      },
      async () => json(await listCatalog()),
    );
    server.registerTool(
      "get_product",
      {
        title: "Lire une fiche produit",
        description: "Une fiche par identifiant.",
        inputSchema: z.object({ id: z.string() }),
      },
      async ({ id }) => json((await getCatalogProduct(id)) ?? { error: "Fiche introuvable" }),
    );
    server.registerTool(
      "upsert_product",
      {
        title: "Créer ou modifier une fiche produit",
        description:
          "Crée une fiche (id absent → dérivé du slug) ou remplace une fiche existante. `data` suit le modèle ProductData : sku, type (hoodie|sweat|tee|pack|acc), name/sub/description/material {fr,en}, price, compare?, badge?, colorKeys[] (clés de la palette), sizes[], soldOut[], soldOutByColor{}, images[{src, alt{fr,en}, colorKey?}]. Les champs omis gardent leur valeur actuelle. La boutique se met à jour immédiatement.",
        inputSchema: z.object({
          id: z.string().optional(),
          slug: z.string().optional(),
          active: z.boolean().optional(),
          sort: z.number().int().optional(),
          data: z
            .object({
              sku: z.string().optional(),
              type: z.enum(["hoodie", "sweat", "tee", "pack", "acc"]).optional(),
              name: localized.optional(),
              sub: localized.optional(),
              price: z.number().optional(),
              compare: z.number().nullable().optional(),
              badge: localized.nullable().optional(),
              description: localized.optional(),
              material: localized.optional(),
              colorKeys: z.array(z.string()).optional(),
              sizes: z.array(z.string()).optional(),
              soldOut: z.array(z.string()).optional(),
              soldOutByColor: z.record(z.string(), z.array(z.string())).optional(),
              images: z
                .array(z.object({ src: z.string(), alt: localized, colorKey: z.string().optional() }))
                .optional(),
            })
            .optional(),
        }),
      },
      async ({ id, slug, active, sort, data }) => {
        const existing = id ? await getCatalogProduct(id) : null;
        const base: ProductData = existing?.data ?? emptyProduct();
        const merged: ProductData = {
          ...base,
          ...(data ?? {}),
          compare: data?.compare === null ? undefined : (data?.compare ?? base.compare),
          badge: data?.badge === null ? undefined : (data?.badge ?? base.badge),
        } as ProductData;
        const finalSlug = slugify(slug ?? existing?.slug ?? merged.name.fr);
        const finalId = existing?.id ?? id ?? finalSlug;
        const errors = validateProduct(finalSlug, merged);
        if (errors.length) return json({ ok: false, errors });
        if (await slugTaken(finalSlug, finalId)) return json({ ok: false, errors: ["Slug déjà utilisé."] });
        await saveCatalogProduct({
          id: finalId,
          slug: finalSlug,
          sort: sort ?? existing?.sort ?? (await listCatalog()).length,
          active: active ?? existing?.active ?? false,
          data: merged,
        });
        await revalidateShop("catalog");
        return json({ ok: true, id: finalId, slug: finalSlug });
      },
    );
    server.registerTool(
      "set_product_online",
      {
        title: "Mettre une fiche en ligne ou hors ligne",
        description: "Bascule la visibilité d'une fiche sur la boutique.",
        inputSchema: z.object({ id: z.string(), active: z.boolean() }),
      },
      async ({ id, active }) => {
        await setProductActive(id, active);
        await revalidateShop("catalog");
        return json({ ok: true });
      },
    );
    server.registerTool(
      "delete_product",
      {
        title: "Supprimer une fiche produit",
        description: "Suppression définitive. Préférer set_product_online pour retirer temporairement.",
        inputSchema: z.object({ id: z.string(), confirm: z.literal(true) }),
      },
      async ({ id }) => {
        await deleteCatalogProduct(id);
        await revalidateShop("catalog");
        return json({ ok: true });
      },
    );
    server.registerTool(
      "get_palette",
      {
        title: "Palette de coloris",
        description: "Coloris disponibles pour les fiches : clé, nom FR/EN, hex.",
        inputSchema: z.object({}),
      },
      async () => json(await getPalette()),
    );
    server.registerTool(
      "save_palette",
      {
        title: "Remplacer la palette de coloris",
        description: "Remplace toute la palette. Un coloris retiré disparaît des fiches qui l'utilisent.",
        inputSchema: z.object({
          colors: z.array(z.object({ key: z.string(), name: localized, hex: z.string().regex(/^#[0-9a-fA-F]{6}$/) })),
        }),
      },
      async ({ colors }) => {
        await savePalette(
          Object.fromEntries(
            colors.map((c) => [slugify(c.key), { ...c, key: slugify(c.key), hex: c.hex.toUpperCase() }]),
          ),
        );
        await revalidateShop("catalog");
        return json({ ok: true, colors: colors.length });
      },
    );
    server.registerTool(
      "request_media_upload",
      {
        title: "Obtenir une URL d'envoi de fichier",
        description:
          "Retourne une URL signée (2 h) vers laquelle envoyer un fichier en PUT (image ou vidéo, 50 Mo max), et l'URL publique à utiliser ensuite dans une fiche ou un bloc marketing.",
        inputSchema: z.object({ folder: z.enum(["products", "marketing"]), filename: z.string() }),
      },
      async ({ folder, filename }) => {
        if (!storageConfigured()) return json({ ok: false, error: "Stockage non configuré" });
        const t = await createUploadTicket(folder, filename);
        const base = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
        return json({
          ok: true,
          method: "PUT",
          uploadUrl: `${base}/storage/v1/object/upload/sign/media/${t.path}?token=${t.token}`,
          publicUrl: t.publicUrl,
          hint: "PUT le fichier brut avec l'en-tête Content-Type adapté, puis utiliser publicUrl.",
        });
      },
    );

    /* ---------- Marketing ---------- */
    server.registerTool(
      "get_marketing",
      {
        title: "Contenu marketing",
        description: "Vidéos de l'accueil (hero, histoire, formes pastel) et bandeau d'annonces.",
        inputSchema: z.object({}),
      },
      async () => json({ media: await getMedia(), banners: await getBanners() }),
    );
    server.registerTool(
      "set_video_block",
      {
        title: "Régler un bloc vidéo de l'accueil",
        description:
          "block=hero (fond du titre) ou story (bloc « Notre histoire »). mode=default (vidéo livrée avec le code), custom (src/poster fournis), hidden (masqué). blobs : formes pastel du hero.",
        inputSchema: z.object({
          block: z.enum(["hero", "story"]),
          mode: z.enum(["default", "custom", "hidden"]),
          src: z.string().optional(),
          poster: z.string().optional(),
          blobs: z.boolean().optional(),
        }),
      },
      async ({ block, mode, src, poster, blobs }) => {
        const media = { ...(await getMedia()) };
        if (mode === "default") delete media[block];
        else if (mode === "hidden") media[block] = null;
        else {
          if (!src) return json({ ok: false, error: "src requis en mode custom" });
          media[block] = { src, poster };
        }
        if (block === "hero") media.heroBlobs = mode === "hidden" ? false : (blobs ?? media.heroBlobs ?? true);
        await saveMedia(media);
        await revalidateShop("settings");
        return json({ ok: true, media });
      },
    );
    server.registerTool(
      "save_banners",
      {
        title: "Remplacer le bandeau d'annonces",
        description: "Messages FR/EN qui défilent au-dessus du header, avec lien et période optionnels (ISO 8601).",
        inputSchema: z.object({
          banners: z.array(
            z.object({
              id: z.string().optional(),
              message: localized,
              href: z.string().optional(),
              startsAt: z.string().optional(),
              endsAt: z.string().optional(),
              active: z.boolean().default(true),
            }),
          ),
        }),
      },
      async ({ banners }) => {
        await saveBanners(
          banners.map((b, i) => ({ ...b, id: b.id ?? `b-${Date.now().toString(36)}-${i}`, order: i + 1 })),
        );
        await revalidateShop("settings");
        return json({ ok: true, banners: banners.length });
      },
    );
    server.registerTool(
      "set_announcement",
      {
        title: "Annonce plein écran (modale)",
        description:
          "Avertissement, promo ou nouveauté affiché une fois par visiteur à l'arrivée. reshow=true la réaffiche à ceux qui l'avaient fermée. active=false la masque.",
        inputSchema: z.object({
          kind: z.enum(["info", "warning", "promo"]).default("info"),
          title: localized,
          text: localized,
          ctaLabel: localized.optional(),
          ctaUrl: z.string().optional(),
          code: z.string().optional(),
          active: z.boolean().default(true),
          startsAt: z.string().optional(),
          endsAt: z.string().optional(),
          reshow: z.boolean().default(false),
        }),
      },
      async ({ reshow, ...a }) => {
        const current = await getAnnouncement();
        const next = { ...a, version: (current?.version ?? 0) + (reshow || !current ? 1 : 0) };
        await saveAnnouncement(next);
        await revalidateShop("settings");
        return json({ ok: true, announcement: next });
      },
    );
    server.registerTool(
      "get_social",
      {
        title: "Réseaux sociaux et contact",
        description: "Liens affichés dans le pied de page.",
        inputSchema: z.object({}),
      },
      async () => json(await getSocialSettings()),
    );
    server.registerTool(
      "save_social",
      {
        title: "Modifier les réseaux sociaux",
        description: "Champs omis conservés, chaîne vide = masqué.",
        inputSchema: z.object({
          instagram: z.string().optional(),
          tiktok: z.string().optional(),
          facebook: z.string().optional(),
          youtube: z.string().optional(),
          email: z.string().optional(),
        }),
      },
      async (patch) => {
        const next = { ...(await getSocialSettings()), ...patch };
        await setSetting(SOCIAL_KEY, next);
        await revalidateShop("settings");
        return json({ ok: true, social: next });
      },
    );

    /* ---------- Newsletter ---------- */
    server.registerTool(
      "newsletter_stats",
      {
        title: "Inscrits à la newsletter",
        description: "Compteurs et liste des inscrits (e-mails, langue, statut).",
        inputSchema: z.object({ includeList: z.boolean().default(false) }),
      },
      async ({ includeList }) =>
        json({ stats: await subscriberStats(), subscribers: includeList ? await listSubscribers() : undefined }),
    );
    server.registerTool(
      "list_campaigns",
      { title: "Lister les campagnes", description: "Brouillons et campagnes envoyées.", inputSchema: z.object({}) },
      async () => json(await listCampaigns()),
    );
    server.registerTool(
      "upsert_campaign",
      {
        title: "Créer ou modifier une campagne",
        description:
          "Sans id : crée un brouillon. body accepte du HTML simple (p, strong, em, u, a, ul/ol/li, h2/h3), nettoyé à l'envoi. Ne l'envoie pas : voir send_campaign.",
        inputSchema: z.object({
          id: z.string().optional(),
          subject: z.string().optional(),
          preheader: z.string().optional(),
          title: z.string().optional(),
          body: z.string().optional(),
          ctaLabel: z.string().optional(),
          ctaUrl: z.string().optional(),
          imageUrl: z.string().optional(),
        }),
      },
      async ({ id, ...patch }) => {
        const campaignId = id ?? (await createCampaign());
        const current = await getCampaign(campaignId);
        if (!current) return json({ ok: false, error: "Campagne introuvable" });
        if (current.status === "sent") return json({ ok: false, error: "Campagne déjà envoyée" });
        const content = {
          subject: current.subject,
          preheader: current.preheader,
          title: current.title,
          body: current.body,
          ctaLabel: current.ctaLabel,
          ctaUrl: current.ctaUrl,
          imageUrl: current.imageUrl,
          ...Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)),
        };
        await updateCampaign(campaignId, content);
        return json({ ok: true, id: campaignId, campaign: await getCampaign(campaignId) });
      },
    );
    server.registerTool(
      "send_test_campaign",
      {
        title: "Envoyer un test de campagne",
        description: "Envoie la campagne à une seule adresse.",
        inputSchema: z.object({ id: z.string(), to: z.string().email() }),
      },
      async ({ id, to }) => {
        const c = await getCampaign(id);
        if (!c) return json({ ok: false, error: "Campagne introuvable" });
        return json(await sendTest(c, to));
      },
    );
    server.registerTool(
      "send_campaign",
      {
        title: "Envoyer une campagne à tous les inscrits",
        description: "Irréversible. confirm doit valoir true.",
        inputSchema: z.object({ id: z.string(), confirm: z.literal(true) }),
      },
      async ({ id }) => json(await sendCampaign(id)),
    );

    /* ---------- Réglages & utilisateurs ---------- */
    server.registerTool(
      "list_feature_flags",
      {
        title: "Fonctionnalités activables",
        description: "Flags de la boutique (connexion e-mail, Google, Apple…).",
        inputSchema: z.object({}),
      },
      async () => json(await listFlags()),
    );
    server.registerTool(
      "set_feature_flag",
      {
        title: "Activer ou couper une fonctionnalité",
        description: "Bascule un flag.",
        inputSchema: z.object({ key: z.string(), enabled: z.boolean() }),
      },
      async ({ key, enabled }) => {
        await setFlag(key, enabled);
        return json({ ok: true });
      },
    );
    server.registerTool(
      "list_users",
      {
        title: "Comptes clients",
        description: "Comptes de la boutique avec rôle et nombre de commandes (lecture seule).",
        inputSchema: z.object({}),
      },
      async () => json(await listUsers()),
    );
  },
  { serverInfo: { name: "koda-admin", version: "1.0.0" } },
);

const verifyToken = async (_req: Request, bearer?: string) => {
  const expected = process.env.MCP_TOKEN;
  if (!expected || !bearer || bearer.length !== expected.length) return undefined;
  const a = new TextEncoder().encode(bearer);
  const b = new TextEncoder().encode(expected);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  if (diff !== 0) return undefined;
  return { token: bearer, clientId: "koda-admin-mcp", scopes: ["admin"] };
};

const secured = withMcpAuth(handler, verifyToken, { required: true });

export { secured as GET, secured as POST, secured as DELETE };
