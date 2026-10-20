# KODA Clothing — boutique Next.js 16

Refonte e-commerce de [kodaclothing.fr](https://kodaclothing.fr/) : Next.js 16 / React 19, vertical slices avec clean
architecture à l'intérieur, domaine strictement pur, Redux Toolkit pour les événements utilisateur et le cache de
données, event bus sur `window` entre slices, i18n FR / EN dès le départ, Tailwind v4 + composants shadcn.

Le POC HTML d'origine est conservé dans `legacy/`.

## Démarrer

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm check          # biome + règles d'architecture + typecheck + tests
pnpm build && pnpm start
```

| Script           | Rôle                                                           |
| ---------------- | -------------------------------------------------------------- |
| `pnpm lint`      | Biome : lint, format, tri des imports                          |
| `pnpm lint:arch` | Règles de dépendances entre slices et couches (voir plus bas)  |
| `pnpm typecheck` | `tsc --noEmit`, clés de traduction typées comprises            |
| `pnpm test`      | Vitest : domaine, cas d'usage, event bus, intégration bus/store |

## Arborescence

```
src/
  app/                    routes Next (composition root : seul endroit qui connaît toutes les slices)
    [locale]/             pages FR (sans préfixe) et EN (/en/...), chemins localisés
    _shell/               header, footer, bandeau, switch de langue, gabarit des pages infos
  slices/
    catalog/  cart/  checkout/  newsletter/  notifications/  home/
      domain/             TypeScript pur : entités, règles, aucune librairie
      application/        cas d'usage, ports, slice RTK, listeners (store → bus), pont (bus → store)
      infrastructure/     adapters : repositories in-memory, Server Actions, gateways client
      ui/                 composants React de la slice
      public-<type>.ts(x) interface publique (types, server, store, ui)
  shared/
    kernel/               primitives partagées pures (locale, money, shipping-policy, result)
    event-bus/            contrat des événements d'intégration + bus CustomEvent sur window
    ui/                   design system : composants shadcn (Button, Sheet, Tabs, Accordion...) + signatures KODA
    seo/  config/         JSON-LD Organization / WebSite, alternates hreflang, config du site
  store/                  composition du store RTK, injection des gateways, hooks typés
  i18n/                   routing (chemins localisés), navigation, chargement des messages
messages/{fr,en}/         un JSON par espace : common, meta, header, footer, home, catalog, cart, checkout...
scripts/                  check-architecture.mjs, import-shopify.mjs
tests/
```

## Règles d'architecture (`pnpm lint:arch`)

- **Interface publique d'une slice** = ses fichiers `public-<type>.ts(x)` à la racine. Tout import venant de l'extérieur
  doit les cibler (`@/slices/catalog/public-server`), jamais un fichier interne.
- **Seule la couche `infrastructure`** d'une slice peut dépendre d'une autre slice, via un adapter (ex. le checkout
  valorise ses lignes avec `CatalogPricingAdapter`, anti-corruption layer sur `catalog/public-server`).
- **`domain`** n'importe que son propre dossier et `@/shared/kernel`. Aucune librairie.
- **`application`** n'importe que le domaine, `@/shared/kernel`, `@/shared/event-bus` et RTK.
- **`ui`** peut lire le store (`@/store/hooks`), jamais une autre slice.
- `shared/` et `i18n/` ignorent les slices, le store et l'app.

## Communication entre slices : event bus

Les slices ne se connaissent pas. Elles publient des faits sur un bus porté par `window` (`CustomEvent` préfixés
`koda:`), dont le contrat typé vit dans `shared/event-bus/contracts.ts` (primitives uniquement) :

```
catalog.product-chosen   →  cart (ajoute la ligne, ouvre le drawer)
cart.line-added          →  notifications (toast « Voir le panier »)
cart.open-requested      →  cart
checkout.order-placed    →  cart (vide le panier), notifications
newsletter.subscribed    →  notifications
```

Côté store, un **listener middleware** RTK traduit les actions en événements (store → bus) et chaque slice expose un
`bindXToBus(bus, dispatch)` pour l'inverse (bus → store). Dans la console : `monitorEvents(window, 'koda:cart.line-added')`.

## État et données (Redux Toolkit)

- `catalog` : cache des produits hydraté depuis le rendu serveur (`CatalogHydrator`), sélecteurs mémoïsés par filtre.
- `catalogApi` : RTK Query pour la recherche instantanée du header, `queryFn` branchée sur une gateway injectée
  (`extra`), qui appelle une Server Action.
- `cart`, `checkout`, `notifications` : slices dont les reducers délèguent toute règle au domaine.
- Les dépendances (bus, gateways) sont injectées dans `makeStore(deps)` : les tests d'intégration les remplacent.

## i18n

`next-intl` avec `localePrefix: "as-needed"` et `localeDetection: false` : `/` sert toujours le français (domaine
.fr, pas de redirection selon `Accept-Language`, ce que Google déconseille), `/en/...` en anglais, chemins localisés
(`/produits/[slug]` ↔ `/en/products/[slug]`), `hreflang` et sitemap multilingue, catalogue traduit dans le repository.
Les clés de traduction sont typées (`src/i18n/global.d.ts`).

## SEO

Metadata par page et par locale, JSON-LD Organization, WebSite + SearchAction, BreadcrumbList, ItemList de Products
(offres PreOrder, livraison, retours), FAQPage ; images Open Graph générées par produit et par locale ; `sitemap.xml`,
`robots.txt`, manifest. Toutes les pages produit sont statiques (SSG).

## Réimporter depuis Shopify

Le site actuel de KODA est sur Shopify, qui expose son catalogue sur `/products.json`. Depuis un poste qui y accède :

```bash
node scripts/import-shopify.mjs https://kodaclothing.fr
```

génère `src/slices/catalog/infrastructure/catalog.shopify.data.ts` (`PRODUCT_SOURCES_SHOPIFY`, `PALETTE_SHOPIFY`)
avec les URL CDN des photos, au format de la slice. Dans `catalog.data.ts`, remplacer ou fusionner les données, puis
compléter les traductions EN, les hex des couleurs inconnues, le grammage et les badges. `cdn.shopify.com` est déjà
autorisé pour `next/image`.

## Données

Le catalogue (`catalog.data.ts`) vient de la boutique Shopify de KODA, regroupé en trois familles déclinées par coloris :
Pull à capuche Koda (6 coloris, 69,99 €), Pull oversized (4 coloris, 49,99 €), T-shirt Koda (5 coloris, 34,99 €).
Prix, matières, grammages, tailles, ruptures et photos sont les leurs. Restent des hypothèses à valider : mesures du
guide des tailles, délais de précommande, seuil de livraison offerte, handles réseaux sociaux, textes légaux
(`messages/`, `shared/config/site.ts`, `shared/kernel/shipping-policy.ts`).

## Étapes suivantes

Stripe Checkout (hébergé) à la place de la Server Action in-memory, stockage des commandes (KV ou Postgres),
newsletter branchée sur un fournisseur, vraies photos, tests end-to-end Playwright en CI.
