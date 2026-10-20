# Médias de marque

Déposer ici les fichiers référencés par `src/shared/config/site.ts` (`SITE.media`) :

| Fichier              | Usage                                            | Recommandation                                         |
| -------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| `koda-story.mp4`     | Section « More than clothing » de la page d'accueil | H.264, muet, 10 à 20 s en boucle, 1280 px de large, < 3 Mo |
| `koda-story.jpg`     | Image affichée avant le démarrage de la vidéo     | Même cadrage, 1280 px, < 150 Ko                        |
| `koda-hero.mp4`      | Fond vidéo du hero (optionnel, `heroVideo`)        | Idem, plans lents, peu de contraste                    |
| `koda-logo.png`      | Logo rond (photo de profil Instagram) animé dans le loader de navigation | PNG carré, 512 px |
| `koda-icon.png`      | Favicon et icône iOS : fond uni bleu ciel, lettres agrandies (lisible en 16 px) | PNG carré 512 px, généré depuis le logo |

Tant que le fichier manque, le bloc se replie sans erreur. Sur Vercel les fichiers de `public/` sont servis par le CDN,
sans coût d'optimisation.
