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

1. **Boutique** : projet Vercel avec *Root Directory* `apps/web`. Variable `DATABASE_URL`.
2. **Admin** : second projet, *Root Directory* `apps/admin`. Variables `DATABASE_URL` (la même), `ADMIN_PASSWORD`,
   `ADMIN_SECRET` (`openssl rand -hex 32`), et pour le direct `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.
   Sans mot de passe et secret, la connexion est refusée en production.
3. **Supabase** (palier gratuit). Le plus simple : dans Vercel, Storage → Create Database → Supabase, puis
   connecter les deux projets. Vercel injecte `POSTGRES_URL` (poolée), `SUPABASE_URL` et
   `SUPABASE_SERVICE_ROLE_KEY`, que les apps reconnaissent : rien d'autre à saisir. Sinon, créer le projet sur
   supabase.com et poser `DATABASE_URL` (chaîne *Transaction pooler*, port 6543), `SUPABASE_URL` et la clé
   `service_role` (Settings → API) à la main. La table est créée au premier événement, avec RLS activée (invisible
   via l'API publique) et ajoutée à la publication Realtime. Neon reste supporté : une URL `*.neon.tech` bascule
   automatiquement sur son driver HTTP.
4. Les variables ne sont lues qu'au build : redéployer après les avoir posées.

Vercel détecte le workspace pnpm et n'installe que ce qu'il faut pour chaque projet ; chaque app est déployée
indépendamment, la boutique reste 100 % statique hors `/api/track`.

**Temps réel.** Le dashboard ouvre un flux Server-Sent Events sur `/api/live` (derrière la session admin) ; cette
route s'abonne côté serveur aux insertions de `analytics_events` via Supabase Realtime avec la clé de service, et
relaie chaque événement au navigateur, qui recalcule les chiffres (regroupés à 1,5 s) et affiche les derniers
événements. Aucune clé Supabase n'atteint le navigateur. Sans Supabase, le dashboard se rafraîchit toutes les 30 s.

## Hébergement à 0 € : boutique sur Cloudflare, admin sur Vercel

Le plan Hobby de Vercel interdit l'usage commercial ; le plan gratuit de Cloudflare Workers l'autorise (100 000 requêtes
par jour). La boutique est donc construite avec [OpenNext](https://opennext.js.org/cloudflare) (`apps/web/open-next.config.ts`,
`apps/web/wrangler.jsonc`) et déployée par GitHub Actions à chaque push sur `main`
(`.github/workflows/deploy-web-cloudflare.yml`). L'admin reste sur Vercel (SMTP et MCP ont besoin d'un vrai Node).
Vercel garde la boutique en secours tant que Cloudflare n'est pas validé.

Mise en place, une seule fois :

1. **Cloudflare** : créer le compte, activer R2 (Dashboard → R2 → Enable, une carte est demandée mais rien n'est débité
   dans le palier gratuit). Noter l'`Account ID` (page d'accueil du compte, colonne de droite).
2. **Jeton API** (Mon profil → Jetons API → Créer → modèle « Edit Cloudflare Workers »), en ajoutant les permissions
   `Workers R2 Storage : Edit` et `Workers Scripts : Edit`. Il sert au workflow de déploiement.
3. **Jeton R2 S3** (R2 → Gérer les jetons API → « Object Read & Write ») : fournit `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY`
   pour les sauvegardes et la copie des vidéos.
4. **Buckets R2** : `kodaclothing-next-cache` (créé par le workflow), `kodaclothing-backups` (privé, règle de cycle de
   vie : supprimer après 30 jours), `kodaclothing-media` (accès public activé : Settings → Public access → r2.dev ou
   domaine personnalisé).
5. **Secrets GitHub** (Settings → Secrets and variables → Actions) : `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
   `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `SUPABASE_DB_URL` (chaîne « Session pooler », port 5432, utilisateur
   `postgres`), et les mêmes variables que sur Vercel : `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `REVALIDATE_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`.
   Variable (onglet Variables) : `SHOP_URL`, l'URL publique de la boutique.
6. Lancer « Deploy web (Cloudflare) » (Actions → Run workflow). La boutique répond sur
   `https://kodaclothing.<sous-domaine>.workers.dev`, puis sur le domaine final (Workers → kodaclothing → Domaines).
   Mettre ensuite à jour `SHOP_URL`, `SHOP_URL` côté admin (Vercel), le domaine dans Stripe et `SITE.url`.

Les autres workflows : `supabase-backup.yml` (export `pg_dump` chaque nuit vers R2, car le plan gratuit de Supabase n'a
pas de sauvegarde), `supabase-keepalive.yml` (une requête par jour pour éviter la mise en pause après 7 jours sans
activité) et `media-to-r2.yml` (copie des vidéos vers le bucket public, trafic sortant illimité ; adapter ensuite
`SITE.media` à l'URL publique du bucket). Les secrets absents font simplement sauter l'étape, avec un avertissement.

En local : `pnpm --filter web preview:cf` construit la boutique pour Workers et la sert avec `wrangler dev`
(cache R2 et Durable Objects émulés). Limite à surveiller sur le plan gratuit : 10 ms de CPU par requête ; les pages
statiques et ISR sont servies depuis le cache, les pages dynamiques tiennent largement (30 à 200 ms de temps total
mesurés en local). Si Cloudflare signale des dépassements, le plan Workers Paid (5 $/mois) lève la limite.

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

## Comptes, rôles et feature flags

- **Supabase Auth** : inscription et connexion par e-mail, Google et Apple (boutons affichés selon les feature flags,
  fournisseurs à activer dans Supabase → Authentication → Providers). Session en cookies (`@supabase/ssr`), rafraîchie
  par le proxy uniquement pour les visiteurs connectés : les pages restent statiques.
- **`profiles`** (rôle `customer` ou `admin`, créé par trigger à l'inscription) et **`orders`** (site et commandes
  migrées depuis Shopify, rattachées au compte par e-mail à l'inscription). RLS : un client ne voit que ses commandes.
- **Boutique** : `/connexion`, `/inscription`, `/compte` (historique des commandes), icône compte dans le header.
  Un admin connecté n'alimente pas les statistiques (clé locale `koda.role`).
- **Admin** : connexion par compte Supabase avec le rôle `admin` (mot de passe maître `ADMIN_PASSWORD` en secours),
  page Utilisateurs (rôles), page Réglages (feature flags `auth.email`, `auth.google`, `auth.apple`).
- **`@koda/db`** : client Postgres partagé (driver `postgres`, pooler Supabase), utilisé par la boutique (commandes,
  session) et l'admin (utilisateurs, flags).
- À faire dans Supabase une fois : Authentication → URL Configuration → Site URL `https://kodaclothing.fr` et
  Redirect URLs `https://<domaine>/auth/callback` (boutique), puis les fournisseurs Google / Apple.

## Newsletter, e-mails et réglages du back-office

- **Inscrits** : `newsletter_subscribers` (statut, langue, jeton de désinscription). Page admin Newsletter : liste,
  export CSV. Désinscription en un clic depuis chaque e-mail (`/newsletter/desinscription?token=…`).
- **Campagnes** : `campaigns` + `campaign_deliveries` (un envoi par destinataire, reprise possible). Éditeur avec
  prévisualisation rendue telle que Gmail, Outlook (table + VML), Apple Mail et texte brut, mode sombre, envoi de test,
  puis envoi à tous les inscrits actifs. Gabarit HTML en tables avec styles inline (`email-template.ts`).
- **Boîte d'envoi** : saisie dans Réglages → Boîte d'envoi (SMTP de la boîte Gmail / Workspace / OVH…, mot de passe
  d'application chiffré AES-GCM en base avec `ADMIN_SECRET`, connexion vérifiée avant enregistrement, e-mail de test).
  Repli sur `SMTP_*` d'environnement, puis Resend (`RESEND_API_KEY`), sinon simulation.
- **Réglages partagés** (`site_settings`, clé → JSON) : réseaux sociaux et e-mail de contact du pied de page, lus par la
  boutique avec un cache d'une heure (`unstable_cache`, tag `settings`) et rafraîchis immédiatement par l'admin via
  `POST /api/revalidate` (`REVALIDATE_SECRET` identique sur les deux projets, `SHOP_URL` sur l'admin).
- **Admin** : barre latérale repliable (desktop) ou tiroir (mobile), libellés lisibles pour les clics et produits,
  parcours d'achat compté en visites distinctes (les taux ne dépassent jamais 100 %).

## Back-office : catalogue, marketing, compte client

- **Catalogue** (`catalog_products`, palette dans `site_settings.catalog.palette`) : fiches FR/EN, prix et prix barré,
  badge, coloris depuis la palette, tailles, stock par taille et par coloris, photos (envoi direct navigateur →
  Supabase Storage, bucket public `media`, liées à un coloris, réordonnables), mise en ligne, ordre d'affichage.
  La boutique lit la base (cache 5 min, tag `catalog`, invalidé par l'admin) et retombe sur `catalog.data.ts` tant
  que la table est vide. Bouton « Importer le catalogue de la boutique » pour démarrer (`GET /api/catalog/sources`).
- **Marketing** : vidéo de fond du hero et bloc « Notre histoire » (vidéo du code, vidéo envoyée, ou masqué) avec
  image d'attente ; bandeau d'annonces (FR/EN, lien, période de diffusion, ordre). Réglages `media` et `banners`,
  lus par la slice `marketing` (tag `settings`).
- **Compte client** (slice `account`) : informations (prénom, nom, téléphone), carnet d'adresses avec adresse par
  défaut (table `addresses`), bloc moyens de paiement prêt pour Stripe. Le checkout est pré-rempli avec l'e-mail et
  l'adresse par défaut du client connecté.
- **Envois de fichiers** : `createSignedUploadUrl` côté serveur (clé service), `uploadToSignedUrl` côté navigateur :
  rien ne transite par Vercel (limite 4,5 Mo), jusqu'à 50 Mo par fichier, 1 Go offerts.

## IA & automatisation (MCP)

L'admin expose un serveur MCP (`apps/admin/src/app/api/mcp/route.ts`, `mcp-handler`) protégé par le jeton
`MCP_TOKEN` (`Authorization: Bearer …`). 22 outils reprennent les mêmes bibliothèques que l'interface : statistiques,
fiches produit (lecture, création, modification, mise en ligne, suppression), palette, envoi de médias (URL signée),
vidéos et bandeau, réseaux sociaux, newsletter (inscrits, campagnes, test, envoi), feature flags, comptes. Chaque
écriture rafraîchit la boutique. La page admin « IA & automatisation » donne la configuration à coller dans Claude,
Cursor ou Claude Code.

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
  Postgres (Supabase ou Neon en production, testé sur un Postgres embarqué PGlite). `createAnalyticsStoreFromEnv`
  choisit selon l'environnement.
- **`apps/admin`** : connexion par mot de passe (cookie HMAC signé, 7 jours, `proxy.ts` en garde), tableau de bord
  calculé à la demande sur 7 / 30 / 90 jours : KPI, pages vues et commandes par jour, entonnoir avec taux d'étape,
  produits (vues → paniers), pages, clics, frictions (erreurs checkout, recherches sans résultat), langues ; mis à
  jour en direct par Supabase Realtime (voir « Temps réel » plus haut).
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
