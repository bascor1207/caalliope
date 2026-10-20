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

## En cours / à configurer par KODA
- Admin → Catalogue → « Importer le catalogue de la boutique » (une fois le déploiement passé) : les fiches deviennent éditables.
- Admin → Réglages → Boîte d'envoi : smtp.gmail.com / bcorre.work@gmail.com / mot de passe d'application, puis « Envoyer le test ».

- Supabase → Authentication : Site URL, Redirect URLs, fournisseurs Google (gratuit) et Apple (compte développeur KODA, 99 €/an).
- Boîte d'envoi des e-mails : à saisir dans l'admin (Réglages → Boîte d'envoi) avec un mot de passe d'application Gmail (bcorre.work@gmail.com pour l'instant, la boîte KODA ensuite). Gmail : ~500 mails/jour, Workspace : 2 000.
- `REVALIDATE_SECRET` (même valeur sur les deux projets Vercel) + `SHOP_URL` sur l'admin : la boutique se rafraîchit dès qu'un réglage change.
- Premier compte admin : inscription sur la boutique puis rôle admin dans Utilisateurs.

## À faire

- Paiement Stripe Checkout (Apple Pay / Google Pay inclus), commandes relues par webhook.
- Migration Shopify : produits (déjà importés en données), clients (invitation), commandes (CSV → `orders`, source shopify).
- Produits et bannières éditables depuis l'admin (plus de fichier de données).
- Serveur MCP exposé par l'admin pour automatiser la création de contenu avec des IA (fiches, bannières, posts, campagnes).
- Bandeau de consentement uniquement si un pixel tiers (Meta, Google) est ajouté.
- Passes de polish : espacements, sections, Syne 500 pour les titres secondaires si besoin.

## Idées en vrac

- Carte Apple Wallet pour le suivi de commande.
- Notifications de restock par taille et coloris.
- Codes promo et parrainage.
