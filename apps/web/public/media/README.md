# Médias de marque

Seuls le logo et l'icône vivent ici (servis par le CDN Vercel). Les vidéos sont hébergées sur Supabase Storage
(bucket public `media`, dossier `marketing/`) et référencées par `src/shared/config/site.ts` (`SITE.media`) ;
le back-office (Marketing) permet d'en envoyer d'autres sans toucher au code.

| Fichier          | Usage                                                                     | Recommandation                          |
| ---------------- | ------------------------------------------------------------------------- | --------------------------------------- |
| `koda-logo.png`  | Logo rond (photo de profil Instagram) animé dans le loader de navigation  | PNG carré, 512 px                       |
| `koda-icon.png`  | Favicon et icône iOS : fond uni bleu ciel, lettres agrandies (lisible en 16 px) | PNG carré 512 px, généré depuis le logo |

Vidéos hébergées (Supabase Storage, `marketing/`) :

| Fichier          | Usage                                               | Recommandation                                         |
| ---------------- | --------------------------------------------------- | ------------------------------------------------------ |
| `koda-story.mp4` | Section « More than clothing » de la page d'accueil | H.264, muet, 10 à 20 s en boucle, 1280 px, < 3 Mo      |
| `koda-story.jpg` | Affiche avant le démarrage de la vidéo              | Même cadrage, 1280 px, < 150 Ko                        |
| `koda-hero.mp4`  | Fond vidéo du hero                                  | Idem, plans lents, peu de contraste                    |
| `koda-hero.jpg`  | Affiche du hero                                     | Idem                                                   |

Si un fichier manque, le bloc se replie sans erreur. Ne jamais remettre de vidéo dans le dépôt : elle gonflerait
chaque déploiement et le clone Git.
