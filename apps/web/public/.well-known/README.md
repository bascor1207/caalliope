# Apple Pay (Stripe)

Pour qu'Apple Pay apparaisse sur un domaine, Stripe doit pouvoir lire le fichier
`apple-developer-merchantid-domain-association` à cette adresse :
`https://<domaine>/.well-known/apple-developer-merchantid-domain-association`.

1. Stripe Dashboard → Réglages → Paiements → « Domaines de moyens de paiement » → Ajouter le domaine.
2. Télécharger le fichier proposé par Stripe et le déposer ici, tel quel (sans extension).
3. Déployer, puis « Vérifier » dans Stripe. Google Pay et Link n'ont besoin que de l'enregistrement du domaine.
