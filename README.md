# KODA Clothing — POC e-commerce

Proof of concept visuel pour la refonte du site [kodaclothing.fr](https://kodaclothing.fr/).
Une seule page statique, zéro dépendance, zéro requête réseau hors Google Fonts.

## Lancer

Ouvrir `index.html` dans un navigateur, ou :

```bash
npx serve .
```

## Ce que contient le POC

- **Identité** : palette pastel/neutre (sauge, lavande, sable, ciel, argile, craie) sur fond crème, typo Syne + Instrument Serif, ton tutoiement « né d'une amitié ».
- **Hero** : blobs animés, titre cinétique, cartes produits flottantes avec parallaxe souris, countdown de clôture du drop.
- **Catalogue in-memory** (`PRODUCTS` dans le script) : 6 pièces, swatches couleur qui recolorent l'image placeholder, aperçu rapide, tailles avec rupture, panier drawer avec barre livraison offerte.
- **Placeholders images** : silhouettes SVG hoodie / tee teintées par la couleur du produit. À remplacer par les vraies photos.
- **SEO** : title / description / canonical / hreflang, Open Graph + Twitter, JSON-LD Organization, WebSite + SearchAction, BreadcrumbList, ItemList de Products avec Offer (EUR, PreOrder, livraison, retours), FAQPage synchronisé avec la section FAQ, `robots.txt`, `sitemap.xml`, manifest.
- **Accessibilité / perf** : HTML sémantique, `dialog` natifs, focus visible, `prefers-reduced-motion`, aucune lib JS.

## Hypothèses à valider avec KODA

Prix (68 € hoodie, 38 € tee), grammages, lieu de confection, délais de précommande, handles réseaux sociaux, URLs produits. Tout est centralisé dans le script et les blocs JSON-LD.

## Étape suivante : Next.js sur Vercel

- Next.js 15 / React 19, App Router, output statique (`export`) ou ISR pour rester dans le free tier Vercel.
- `PRODUCTS` devient le repository in-memory (gateway), remplaçable par une vraie source plus tard.
- JSON-LD généré côté serveur depuis la même source, `generateMetadata` par page produit, `sitemap.ts` et `robots.ts` natifs.
- Images réelles via `next/image` en AVIF/WebP, fonts via `next/font` (self-hosted, zéro requête externe).
- Checkout Stripe Checkout (hébergé, pas de PCI à gérer).
