# KODA Clothing — boutique et admin (monorepo)

Refonte e-commerce de [kodaclothing.fr](https://kodaclothing.fr/) : Next.js 16 / React 19, vertical slices avec clean
architecture à l'intérieur, domaine strictement pur, Redux Toolkit pour les événements utilisateur et le cache de
données, event bus sur `window` entre slices, i18n FR / EN dès le départ, Tailwind v4 + composants shadcn.
Site conçu et développé par GOLEM CORP. Le POC HTML d'origine est conservé dans `legacy/`.

```
apps/web            la boutique (kodaclothing.fr)
apps/admin          le tableau de bord (audience, entonnoir, frictions), à héberger sur un second projet Vercel
packages/analytics  @koda/analytics : contrats d'événements, synthèse KPI, stockage (partagé par les deux apps)
scripts/            seed-analytics.mjs (données de démo pour le dashboard)
```

Monorepo pnpm sans outil de build supplémentaire : les packages sont consommés en source TypeScript
(`transpilePackages`), donc partagés au build, sans aucun coût à l'exécution ni poids supplémentaire côté boutique.

## Démarrer

```bash
pnpm install
pnpm dev              # boutique  → http://localhost:3000
pnpm dev:admin        # admin     → http://localhost:3001  (mot de passe dev : koda)
pnpm seed:analytics   # 30 jours de visites simulées envoyées à la boutique (dashboard non vide)
pnpm check            # biome + règles d'architecture + typecheck + tests des trois paquets
pnpm build            # build des deux apps
```

En développement, les deux apps partagent le fichier `.data/analytics.jsonl` à la racine : ce que la boutique mesure
apparaît dans l'admin au rechargement.

| Script           | Rôle                                                                  |
| ---------------- | --------------------------------------------------------------------- |
| `pnpm lint`      | Biome : lint, format, tri des imports (config unique à la racine)     |
| `pnpm lint:arch` | Règles de dépendances entre slices et couches de la boutique          |
| `pnpm typecheck` | `tsc --noEmit` dans chaque paquet, clés de traduction typées comprises |
| `pnpm test`      | Vitest : domaine, cas d'usage, bus, store, SQL (Postgres embarqué)     |

## Déployer sur Vercel (deux projets, zéro euro)

1. **Boutique** : projet Vercel avec *Root Directory* `apps/web`. Variable `DATABASE_URL` (Neon, palier gratuit).
2. **Admin** : second projet, *Root Directory* `apps/admin`. Variables `DATABASE_URL` (la même), `ADMIN_PASSWORD`,
   `ADMIN_SECRET` (32+ caractères aléatoires). Sans ces deux dernières, la connexion est refusée en production.
3. Neon : créer un projet gratuit, copier la chaîne de connexion *pooled*. La table est créée automatiquement au
   premier événement. Sans `DATABASE_URL`, la boutique garde les événements en mémoire (perdus à chaque déploiement).

Vercel détecte le workspace pnpm et n'installe que ce qu'il faut pour chaque projet ; chaque app est déployée
indépendamment, la boutique reste 100 % statique hors `/api/track`.

## Arborescence de la boutique (`apps/web`)

```
src/
  app/                    routes Next (composition root : seul endroit qui connaît toutes les slices)
    [locale]/             pages FR (sans préfixe) et EN (/en/...), chemins localisés
    _shell/               header, footer, bandeau, switch de langue, gabarit des pages infos
  slices/
    catalog/  cart/  checkout/  newsletter/  notifications/  home/  marketing/  analytics/
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

## Marketing, analytics et admin

- **`marketing`** : le bandeau au-dessus du header lit des bannières (texte FR/EN, lien, fenêtre de diffusion, ordre)
  depuis un repository, aujourd'hui in-memory (`banners.data.ts`). Prochaine brique de l'admin : éditer ce repository.
- **`analytics`** (boutique) : un traceur côté client s'abonne au bus (fiche vue, ajout panier, recherche, checkout
  démarré ou refusé, commande, inscription) et aux clics sur tout élément `data-track="zone.action"` (CTA du hero,
  cartes, bannières, recommandations…), puis envoie des lots anonymes à `/api/track` (sendBeacon). Aucune donnée
  personnelle, aucun cookie : un identifiant aléatoire en sessionStorage, pas d'IP, pas de recoupement. C'est la
  mesure d'audience exemptée de consentement au sens de la CNIL ; la page Confidentialité l'explique et propose une
  opposition (`AnalyticsOptOut`). Le jour où un pixel tiers (Meta, Google) est ajouté, un bandeau de consentement
  devient obligatoire.
- **`@koda/analytics`** : contrats (`AnalyticsEvent`), nettoyage (`sanitizeEvents`), synthèse (`summarize` : sessions,
  pages, entonnoir, revenus, clics, frictions, série journalière) et stores : mémoire, fichier JSONL (dev) et SQL
  Postgres (Neon en production, testé sur PGlite). `createAnalyticsStoreFromEnv` choisit selon l'environnement.
- **`apps/admin`** : connexion par mot de passe (cookie HMAC signé, 7 jours, `proxy.ts` en garde), tableau de bord
  calculé à la demande sur 7 / 30 / 90 jours : KPI, pages vues et commandes par jour, entonnoir avec taux d'étape,
  produits (vues → paniers), pages, clics, frictions (erreurs checkout, recherches sans résultat), langues.
- **Médias** : vidéos de marque dans `public/media/` (voir le README du dossier), référencées par `SITE.media`.

## État et données (Redux Toolkit)

- `catalog` : cache des produits fourni au store en état initial par le layout (aucun dispatch pendant le rendu),
  sélecteurs mémoïsés par filtre ; le filtre de la collection vit dans l'URL sans sortir du rendu statique.
- `catalogApi` : RTK Query pour la recherche instantanée du header, `queryFn` branchée sur une gateway injectée
  (`extra`), qui appelle une Server Action.
- `cart`, `checkout`, `notifications` : slices dont les reducers délèguent toute règle au domaine. À l'ajout au panier,
  la modale « Parfait avec » (slice panier) reçoit les recommandations du catalogue par la composition root
  (`_shell/added-to-cart.tsx`) : les deux slices ne se connaissent pas.
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
Prix, matières, grammages, tailles, ruptures et photos sont les leurs. Les photos sont servies par le CDN Shopify via un loader `next/image` custom (`shared/ui/image-loader.ts`) :
redimensionnement par le CDN et WebP / AVIF négociés par le navigateur, sans consommer l'optimisation d'images Vercel. Restent des hypothèses à valider : mesures du
guide des tailles, délais de précommande, seuil de livraison offerte, handles réseaux sociaux, textes légaux
(`messages/`, `shared/config/site.ts`, `shared/kernel/shipping-policy.ts`).

## Étapes suivantes

Stripe Checkout (hébergé, seuls frais : la commission par transaction) à la place de la Server Action in-memory,
commandes relues depuis Stripe par webhook, édition du catalogue et des bannières depuis l'admin par commit via l'API
GitHub (git comme base de données, déploiement automatique), newsletter branchée sur un fournisseur gratuit, tests
end-to-end Playwright et audit axe en CI.
