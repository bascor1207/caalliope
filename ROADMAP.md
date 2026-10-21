# Roadmap KODA

Suivi des idées et de leur état. Mis à jour à chaque lot livré.

## Fait

- Boutique Next.js 16 : vertical slices, domaine pur, RTK, event bus, i18n FR/EN, SEO complet, a11y zéro violation axe.
- Monorepo : boutique, admin, packages `analytics` et `db`. Deux projets Vercel, Supabase (Paris, gratuit).
- Analytics maison sans cookie (CNIL mesure d'audience), opposition, admins exclus, dashboard temps réel (Supabase Realtime).
- Comptes clients (e-mail, Google / Apple par feature flags), rôles, historique de commandes, admin réservé au rôle admin.
- Feature flags pilotés depuis l'admin. Page Utilisateurs.
- Newsletter : inscrits en base, désinscription par lien, campagnes depuis l'admin avec prévisualisation par client mail.
- Loader de navigation avec le logo, favicon, typo Outfit + Instrument Sans, modale panier, skeletons shimmer.

- Back-office premium : catalogue éditable (fiches, photos, stock, palette), marketing (vidéos, bandeau), réglages (boîte d'envoi, réseaux).
- Espace compte : informations, adresses, paiement (placeholder Stripe), commandes ; checkout pré-rempli.
- Cartes produit : survol fluide (transform + ombre en opacité), loader de navigation robuste au retour arrière.

- Hero : parallaxe lissée (rAF + interpolation), formes pastel pilotées depuis Marketing, entrée des cartes sans conflit.
- Page d'erreur (header + footer + réessayer) et erreur globale ; pages en erreur comptées dans l'admin (hors 404).
- Toasts partout (boutique et admin) et rendu optimiste : adresses, profil, interrupteurs (flags, rôle, fiche en ligne).
- Téléphones formatés avec l'indicatif international (+33 6 …), stockés en E.164.

- Temps réel boutique : `catalog_versions` incrémentée par trigger à chaque écriture (fiches, réglages), écoutée par les navigateurs (Supabase Realtime) → relecture RTK Query en tâche de fond + rafraîchissement doux des composants serveur. Fiche produit vivante (prix, stock, photos).
- Newsletter : inscription optimiste, nouveau wording (« Ne rate pas le prochain drop », code 10 % conservé).
- Vercel : builds de preview désactivés sur les deux projets.

- Campagnes : éditeur riche (gras, italique, souligné, titres, listes, liens), HTML nettoyé et stylé inline pour les clients mail.
- Admin : fil d'Ariane + bouton retour sur toutes les pages ; toasts verts pour les succès.

- SEO : pages catégories indexables (hoodies, sweats, t-shirts, FR/EN), JSON-LD ProductGroup avec variantes et stock réel, flux Google Merchant (`/feed/google-merchant.xml`), robots.txt complet, sitemap enrichi, OG à jour.
- Curseurs : main sur tout ce qui se clique, curseur maison « agrandir / réduire » sur la galerie produit.

- Serveur MCP de l'admin (`/api/mcp`, jeton `MCP_TOKEN`) : 22 outils (catalogue, médias, marketing, newsletter, réglages, stats) pour piloter le back-office depuis Claude, Cursor… Page « IA & automatisation » avec la config.
- Admin mobile : onglets par section (ancres), sous-menus dans la barre latérale, KPI compacts.

- Annonce plein écran (modale) pilotée depuis Marketing et le MCP : avertissement / promo / nouveauté, code copiable, période, vue une fois par visiteur, « réafficher » par version.
- Analytics v2 : trafic de l'équipe exclu (`?koda_internal=1`, bouton dans l'admin), `checkout_started` au clic sur Payer, coloris et taille sur vues / ajouts / tailles choisies, clics sur ruptures (`soldout_click` + toast vers la newsletter), commande complète (articles, sous-total, port, remise, code promo), provenance par session (utm_*, referrer, `session_start`), `cart_view` / `remove_from_cart`, `newsletter_signup` par origine ; tableau de bord « Ventes & réassort » (par coloris, demande non servie, panier moyen, sources, promos) et `get_analytics` enrichi ; outil MCP `delete_campaign`.
- Sauvegardes nocturnes de la base (pg_dump + export JSON) vers R2 privé, 30 jours de rétention, orchestrées par un Worker planifié et le CI Cloudflare : aucun secret GitHub, aucune clé S3.
- Boutique hébergée sur Cloudflare Workers (plan gratuit, usage commercial autorisé) via OpenNext : build et déploiement automatiques à chaque push sur `main` (Workers Builds), cache ISR dans R2, secrets posés sur le Worker ; vidéos servies depuis R2 (bucket public, trafic sortant illimité). Vercel conservé pour l'admin. Accès Postgres via Hyperdrive (workerd ne sait pas monter le STARTTLS de Postgres) ; les composition roots choisissent Postgres ou mémoire à l'usage (`whenDatabase`), car les bindings n'existent qu'au sein d'une requête sur Workers. Sonde `/api/health` (Bearer REVALIDATE_SECRET).
- MCP admin branchable dans claude.ai / ChatGPT : serveur OAuth 2.1 sans état (enregistrement dynamique, PKCE, consentement dans l'admin), en plus du jeton fixe.
- Ajout rapide depuis la collection : rangée de tailles au survol (desktop), bouton « + » et feuille de tailles (mobile), optimiste, toast vert « Voir le panier » ; mesuré (`product_chosen` source `quick`).
- Achat express Stripe sur la fiche produit : Apple Pay / Google Pay / Link (Express Checkout Element), montant et livraison recalculés côté serveur, commande enregistrée après vérification du paiement (`payment_ref`). Affiché dès que les clés Stripe sont présentes.
- Vidéos de marque hébergées sur Supabase Storage (bucket `media/marketing`, 6,4 Mo retirés du dépôt et des déploiements) ; dates des annonces et bandeaux saisies en heure de Paris.
- Animations lissées : cartes « Notre histoire » (survol sur un calque séparé), flou d'en-tête allégé, formes pastel moins coûteuses (2 sur mobile), transitions ciblées.

## En cours / à configurer par KODA
- Cloudflare : valider la boutique sur https://kodaclothing.kodaclothing.workers.dev (navigation, panier, compte, Apple Pay), puis brancher le domaine final sur le Worker (Workers & Pages → kodaclothing → Domaines), mettre à jour `NEXT_PUBLIC_SITE_URL` (variable de build Cloudflare), `SHOP_URL` côté admin (Vercel) et le domaine dans Stripe ; ensuite retirer le projet Vercel de la boutique.
- Stripe : clés de test en place sur Vercel, domaine `kodaclothing.vercel.app` validé (Apple Pay, Google Pay, Link actifs). Pour encaisser pour de vrai : activer le compte Stripe, remplacer les deux clés par les clés `live`, et ajouter le domaine final.
- Domaine final à brancher sur Vercel (puis `NEXT_PUBLIC_SITE_URL` à mettre à jour), Google Search Console (sitemap) et Merchant Center (flux).
- Admin → Catalogue → « Importer le catalogue de la boutique » (une fois le déploiement passé) : les fiches deviennent éditables.
- Admin → Réglages → Boîte d'envoi : smtp.gmail.com / bcorre.work@gmail.com / mot de passe d'application, puis « Envoyer le test ».

- Supabase → Authentication : Site URL, Redirect URLs, fournisseurs Google (gratuit) et Apple (compte développeur KODA, 99 €/an).
- Boîte d'envoi des e-mails : à saisir dans l'admin (Réglages → Boîte d'envoi) avec un mot de passe d'application Gmail (bcorre.work@gmail.com pour l'instant, la boîte KODA ensuite). Gmail : ~500 mails/jour, Workspace : 2 000.
- `REVALIDATE_SECRET` (même valeur sur les deux projets Vercel) + `SHOP_URL` sur l'admin : la boutique se rafraîchit dès qu'un réglage change.
- Premier compte admin : inscription sur la boutique puis rôle admin dans Utilisateurs.

## À faire

- Espace client : page de détail d'une commande passée (articles, adresse, paiement, facture, suivi) depuis « Mes commandes ».
- Admin : modes de livraison configurables (nom, prix, délai, seuil d'offre) transmis à Apple Pay / Google Pay et au checkout, à la place de la règle codée (4,90 €, offerte dès 80 €).
- Module facturation : PDF numéroté par commande, envoyé avec la confirmation, téléchargeable dans le compte et l'admin, avoirs sur remboursement (mentions légales à fournir).
- Paiement Stripe du panier complet (le checkout classique reste une précommande sans débit), webhook pour relire les paiements.
- Migration Shopify : produits (déjà importés en données), clients (invitation), commandes (CSV → `orders`, source shopify).
- Produits et bannières éditables depuis l'admin (plus de fichier de données).
- Serveur MCP exposé par l'admin pour automatiser la création de contenu avec des IA (fiches, bannières, posts, campagnes).
- Bandeau de consentement uniquement si un pixel tiers (Meta, Google) est ajouté.
- Passes de polish : espacements, sections, Syne 500 pour les titres secondaires si besoin.

## Idées en vrac

- Carte Apple Wallet pour le suivi de commande.
- Notifications de restock par taille et coloris.
- Codes promo et parrainage.
